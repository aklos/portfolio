"""Pick a cover image for a post, visually.

Opens a local page where you can search Unsplash or drop in your own file.
Whichever you choose is cropped to Substack's 1456x1048, written to
public/covers/<slug>.jpg, and recorded in the post's frontmatter — including
the photographer credit, which Unsplash's API terms require you to display.

The frontmatter is written into the Obsidian draft, since that's the source of
truth, and then synced through to src/content/blog. A post with no draft is
edited in the repo directly.

Usage:
    python scripts/cover_picker.py <slug> [--query "search terms"]

Needs UNSPLASH_ACCESS_KEY in .env (create an app at
https://unsplash.com/oauth/applications) and the local extras:
    pip install -r scripts/requirements-local.txt
"""

from __future__ import annotations

import argparse
import io
import json
import os
import threading
import urllib.parse
import webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

import requests
from dotenv import load_dotenv

import post as postlib
import sync_vault
from post import COVERS_DIR, REPO_ROOT, fail

COVER_WIDTH = 1456
COVER_HEIGHT = 1048
UNSPLASH_API = "https://api.unsplash.com"
# Unsplash requires attribution links carry these
UTM = "utm_source=alexklos&utm_medium=referral"

PAGE = """<!doctype html>
<meta charset="utf-8">
<title>Cover for __TITLE__</title>
<style>
  :root { --ink:#16324f; --orange:#f07f23; --muted:#5d7290; --line:#e3e8ef; }
  * { box-sizing: border-box; }
  body { margin:0; font:16px/1.5 system-ui, sans-serif; color:var(--ink); background:#fff; }
  header { padding:24px 32px; border-bottom:1px solid var(--line); position:sticky; top:0; background:#fff; z-index:2; }
  h1 { margin:0 0 4px; font-size:18px; }
  .sub { color:var(--muted); font-size:14px; }
  .controls { display:flex; gap:12px; margin-top:16px; flex-wrap:wrap; }
  input[type=search] { flex:1; min-width:240px; padding:10px 14px; border:1px solid var(--line); border-radius:6px; font-size:15px; }
  button { padding:10px 18px; border:0; border-radius:6px; background:var(--ink); color:#fff; font-size:15px; cursor:pointer; }
  button:disabled { opacity:.4; cursor:default; }
  .drop { margin-top:12px; padding:14px; border:2px dashed var(--line); border-radius:6px; text-align:center; color:var(--muted); font-size:14px; cursor:pointer; }
  .drop.over { border-color:var(--orange); color:var(--ink); }
  main { padding:24px 32px 120px; }
  .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:16px; }
  figure { margin:0; cursor:pointer; border:3px solid transparent; border-radius:8px; overflow:hidden; background:#f6f8fa; }
  figure.sel { border-color:var(--orange); }
  figure img { width:100%; aspect-ratio:1456/1048; object-fit:cover; display:block; }
  figcaption { padding:8px 10px; font-size:12px; color:var(--muted); }
  footer { position:fixed; bottom:0; left:0; right:0; padding:16px 32px; background:#fff; border-top:1px solid var(--line); display:flex; gap:16px; align-items:center; }
  .status { color:var(--muted); font-size:14px; }
  .done { padding:40px 32px; font-size:16px; }
  .hidden { display:none !important; }
  #stage { position:relative; display:inline-block; max-width:100%; user-select:none; }
  #stage img { display:block; max-width:min(900px,100%); height:auto; }
  #win { position:absolute; border:2px solid var(--orange); cursor:grab;
         box-shadow:0 0 0 9999px rgba(255,255,255,.72); }
  #win.drag { cursor:grabbing; }
  #win::after { content:''; position:absolute; inset:0;
                background:linear-gradient(to right,transparent 33%,rgba(240,127,35,.35) 33%,rgba(240,127,35,.35) 33.4%,transparent 33.4%,transparent 66%,rgba(240,127,35,.35) 66%,rgba(240,127,35,.35) 66.4%,transparent 66.4%); }
  .zoom { display:flex; align-items:center; gap:12px; margin-top:16px; font-size:14px; color:var(--muted); }
  .zoom input { flex:1; max-width:320px; }
</style>

<header>
  <h1>Cover for &ldquo;__TITLE__&rdquo;</h1>
  <div class="sub">Cropped to 1456&times;1048 &rarr; public/covers/__SLUG__.jpg</div>
  <div class="controls">
    <input type="search" id="q" value="__QUERY__" placeholder="Search Unsplash&hellip;">
    <button id="go">Search</button>
  </div>
  <div class="drop" id="drop">or drop your own image here &mdash; click to browse</div>
  <input type="file" id="file" accept="image/*" hidden>
</header>

<main>
  <div class="grid" id="grid"></div>
  <div id="cropview" class="hidden">
    <div id="stage"><img id="preview" alt=""><div id="win"></div></div>
    <div class="zoom">
      <label for="zoom">Zoom</label>
      <input type="range" id="zoom" min="35" max="100" value="100">
      <span>drag the frame to reposition</span>
    </div>
  </div>
</main>

<footer>
  <button id="use" disabled>Use this photo</button>
  <button id="save" class="hidden">Save cover</button>
  <button id="back" class="hidden">Back</button>
  <span class="status" id="status">Search, or drop in a file.</span>
</footer>

<script>
const grid = document.getElementById('grid');
const status = document.getElementById('status');
const useBtn = document.getElementById('use');
let selected = null;

function setStatus(text) { status.textContent = text; }

async function search() {
  const q = document.getElementById('q').value.trim();
  if (!q) return;
  setStatus('Searching\\u2026');
  grid.innerHTML = '';
  selected = null; useBtn.disabled = true;
  const res = await fetch('/api/search?q=' + encodeURIComponent(q));
  if (!res.ok) { setStatus('Search failed: ' + await res.text()); return; }
  const photos = await res.json();
  if (!photos.length) { setStatus('No results.'); return; }
  setStatus(photos.length + ' results \\u2014 click one.');
  for (const p of photos) {
    const fig = document.createElement('figure');
    fig.innerHTML = '<img loading="lazy" src="' + p.thumb + '" alt="">' +
      '<figcaption>' + p.credit + '</figcaption>';
    fig.onclick = () => {
      document.querySelectorAll('figure').forEach(f => f.classList.remove('sel'));
      fig.classList.add('sel');
      selected = p; useBtn.disabled = false;
      setStatus('Selected: ' + p.credit);
    };
    grid.appendChild(fig);
  }
}

document.getElementById('go').onclick = search;
document.getElementById('q').onkeydown = e => { if (e.key === 'Enter') search(); };

// ---- crop stage: aspect-locked window you drag over the image ----
const TARGET = 1456 / 1048;
const cropview = document.getElementById('cropview');
const stage = document.getElementById('stage');
const preview = document.getElementById('preview');
const win = document.getElementById('win');
const zoom = document.getElementById('zoom');
const saveBtn = document.getElementById('save');
const backBtn = document.getElementById('back');
let pending = null;   // {kind:'unsplash', photo} | {kind:'file', file}
let frame = null;     // {x, y, w, h} in displayed pixels

function layout(keepCentre) {
  const W = preview.clientWidth, H = preview.clientHeight;
  if (!W || !H) return;
  let maxW, maxH;
  if (W / H > TARGET) { maxH = H; maxW = H * TARGET; }
  else { maxW = W; maxH = W / TARGET; }

  const scale = zoom.value / 100;
  const w = maxW * scale, h = maxH * scale;
  const cx = keepCentre && frame ? frame.x + frame.w / 2 : W / 2;
  const cy = keepCentre && frame ? frame.y + frame.h / 2 : H / 2;

  frame = { w: w, h: h,
            x: Math.min(Math.max(cx - w / 2, 0), W - w),
            y: Math.min(Math.max(cy - h / 2, 0), H - h) };
  draw();
}

function draw() {
  win.style.left = frame.x + 'px';
  win.style.top = frame.y + 'px';
  win.style.width = frame.w + 'px';
  win.style.height = frame.h + 'px';
}

zoom.oninput = () => layout(true);
window.onresize = () => layout(true);

let dragFrom = null;
win.onmousedown = e => {
  e.preventDefault();
  dragFrom = { mx: e.clientX, my: e.clientY, x: frame.x, y: frame.y };
  win.classList.add('drag');
};
document.addEventListener('mousemove', e => {
  if (!dragFrom) return;
  const W = preview.clientWidth, H = preview.clientHeight;
  frame.x = Math.min(Math.max(dragFrom.x + e.clientX - dragFrom.mx, 0), W - frame.w);
  frame.y = Math.min(Math.max(dragFrom.y + e.clientY - dragFrom.my, 0), H - frame.h);
  draw();
});
document.addEventListener('mouseup', () => { dragFrom = null; win.classList.remove('drag'); });

function showCrop(src, label) {
  preview.onload = () => { zoom.value = 100; layout(false); };
  preview.src = src;
  grid.classList.add('hidden');
  document.querySelector('header .controls').classList.add('hidden');
  document.getElementById('drop').classList.add('hidden');
  cropview.classList.remove('hidden');
  useBtn.classList.add('hidden');
  saveBtn.classList.remove('hidden');
  backBtn.classList.remove('hidden');
  setStatus(label + ' — drag the frame, then save.');
}

backBtn.onclick = () => location.reload();

function box() {
  const W = preview.clientWidth, H = preview.clientHeight;
  return { x: frame.x / W, y: frame.y / H, w: frame.w / W, h: frame.h / H };
}

useBtn.onclick = () => {
  if (!selected) return;
  pending = { kind: 'unsplash', photo: selected };
  showCrop(selected.thumb_large, selected.credit);
};

saveBtn.onclick = async () => {
  saveBtn.disabled = true;
  setStatus('Cropping and saving...');
  let res;
  if (pending.kind === 'unsplash') {
    res = await fetch('/api/select', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(Object.assign({}, pending.photo, { box: box() })),
    });
  } else {
    res = await fetch('/api/upload', {
      method: 'POST',
      headers: {'X-Filename': pending.file.name, 'X-Crop': JSON.stringify(box())},
      body: pending.file,
    });
  }
  saveBtn.disabled = false;
  finish(res);
};

const drop = document.getElementById('drop');
const file = document.getElementById('file');
drop.onclick = () => file.click();
drop.ondragover = e => { e.preventDefault(); drop.classList.add('over'); };
drop.ondragleave = () => drop.classList.remove('over');
drop.ondrop = e => { e.preventDefault(); drop.classList.remove('over'); upload(e.dataTransfer.files[0]); };
file.onchange = () => upload(file.files[0]);

function upload(f) {
  if (!f) return;
  pending = { kind: 'file', file: f };
  showCrop(URL.createObjectURL(f), f.name);
}

async function finish(res) {
  const text = await res.text();
  if (!res.ok) { setStatus('Failed: ' + text); useBtn.disabled = false; return; }
  document.body.innerHTML = '<div class="done">' + text +
    '<p>You can close this tab.</p></div>';
}
</script>
"""


def crop(data: bytes, box: dict | None = None) -> bytes:
    """Crop to the cover aspect and resize.

    `box` holds the chosen region as fractions of the original (x, y, w, h);
    without one this falls back to a centre crop.
    """
    from PIL import Image

    image = Image.open(io.BytesIO(data)).convert("RGB")
    target = COVER_WIDTH / COVER_HEIGHT
    width, height = image.size

    if box:
        left = min(max(float(box.get("x", 0)), 0.0), 1.0)
        top = min(max(float(box.get("y", 0)), 0.0), 1.0)
        span = min(max(float(box.get("w", 1)), 0.01), 1.0 - left)
        rise = min(max(float(box.get("h", 1)), 0.01), 1.0 - top)
        rect = (
            int(left * width),
            int(top * height),
            int((left + span) * width),
            int((top + rise) * height),
        )
    elif width / height > target:
        new_width = int(height * target)
        left_px = (width - new_width) // 2
        rect = (left_px, 0, left_px + new_width, height)
    else:
        new_height = int(width / target)
        top_px = (height - new_height) // 2
        rect = (0, top_px, width, top_px + new_height)

    image = image.crop(rect).resize((COVER_WIDTH, COVER_HEIGHT), Image.LANCZOS)
    buffer = io.BytesIO()
    image.save(buffer, "JPEG", quality=88, optimize=True)
    return buffer.getvalue()


def save(slug: str, data: bytes, meta: dict[str, str], box: dict | None = None) -> str:
    COVERS_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"{slug}.jpg"
    (COVERS_DIR / filename).write_bytes(crop(data, box))

    # written into the draft; sync it through so the site has the cover too
    written = postlib.set_frontmatter(slug, {"cover": filename, **meta})
    if written != postlib.POSTS_DIR / f"{slug}.md":
        sync_vault.sync_note(written)

    return filename


class Picker(BaseHTTPRequestHandler):
    slug: str
    title: str
    query: str
    access_key: str
    done: threading.Event
    result: dict

    def reply(self, code: int, body: str, content_type="text/plain; charset=utf-8"):
        payload = body.encode()
        self.send_response(code)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def do_GET(self):
        route = urllib.parse.urlparse(self.path)

        if route.path == "/":
            page = (
                PAGE.replace("__TITLE__", self.title)
                .replace("__SLUG__", self.slug)
                .replace("__QUERY__", self.query)
            )
            self.reply(200, page, "text/html; charset=utf-8")
            return

        if route.path == "/api/search":
            query = urllib.parse.parse_qs(route.query).get("q", [""])[0]
            response = requests.get(
                f"{UNSPLASH_API}/search/photos",
                params={
                    "query": query,
                    "per_page": 24,
                    "orientation": "landscape",
                    "content_filter": "high",
                },
                headers={"Authorization": f"Client-ID {self.access_key}"},
                timeout=30,
            )
            if not response.ok:
                self.reply(response.status_code, response.text)
                return

            photos = [
                {
                    "thumb": item["urls"]["small"],
                    "thumb_large": item["urls"]["regular"],
                    "full": item["urls"]["full"],
                    "download_location": item["links"]["download_location"],
                    "credit": item["user"]["name"],
                    "credit_url": f"{item['user']['links']['html']}?{UTM}",
                    "alt": item.get("alt_description") or "",
                }
                for item in response.json().get("results", [])
            ]
            self.reply(200, json.dumps(photos), "application/json")
            return

        self.reply(404, "not found")

    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length)

        try:
            if self.path == "/api/select":
                photo = json.loads(body)

                # Required by the API guidelines on every download
                requests.get(
                    photo["download_location"],
                    headers={"Authorization": f"Client-ID {self.access_key}"},
                    timeout=30,
                )

                image = requests.get(photo["full"], timeout=120)
                image.raise_for_status()
                filename = save(
                    self.slug,
                    image.content,
                    {
                        "coverAlt": photo["alt"] or self.title,
                        "coverCredit": photo["credit"],
                        "coverCreditUrl": photo["credit_url"],
                    },
                    photo.get("box"),
                )
                message = (
                    f"Saved public/covers/{filename} — credited to "
                    f"{photo['credit']}, and written into the frontmatter."
                )

            elif self.path == "/api/upload":
                crop_header = self.headers.get("X-Crop")
                filename = save(
                    self.slug,
                    body,
                    {"coverAlt": self.title},
                    json.loads(crop_header) if crop_header else None,
                )
                message = (
                    f"Saved public/covers/{filename} from "
                    f"{self.headers.get('X-Filename', 'your file')}. "
                    "Set coverAlt in the frontmatter to something descriptive."
                )

            else:
                self.reply(404, "not found")
                return

        except Exception as error:
            self.reply(500, f"{type(error).__name__}: {error}")
            return

        self.result["message"] = message
        self.reply(200, message)
        self.done.set()

    def log_message(self, format, *args):  # noqa: A002 - matches base signature
        pass


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("slug")
    parser.add_argument("--query", help="Initial search terms; defaults to the title.")
    parser.add_argument("--port", type=int, default=8765)
    args = parser.parse_args()

    load_dotenv(REPO_ROOT / ".env")

    access_key = os.getenv("UNSPLASH_ACCESS_KEY", "")
    if not access_key:
        print(
            "warning: UNSPLASH_ACCESS_KEY not set — search will fail, "
            "but you can still drop in your own image"
        )

    post = postlib.load(args.slug)

    Picker.slug = args.slug
    Picker.title = post.title
    Picker.query = args.query or post.title
    Picker.access_key = access_key
    Picker.done = threading.Event()
    Picker.result = {}

    server = ThreadingHTTPServer(("localhost", args.port), Picker)
    threading.Thread(target=server.serve_forever, daemon=True).start()

    url = f"http://localhost:{args.port}/"
    print(f"Pick a cover at {url}  (ctrl-c to cancel)")
    webbrowser.open(url)

    try:
        Picker.done.wait()
    except KeyboardInterrupt:
        print("\ncancelled")
        return
    finally:
        server.shutdown()

    print(Picker.result.get("message", "done"))


if __name__ == "__main__":
    main()

"""Shared loading of blog posts for the syndication scripts.

Mirrors the defaults in src/lib/blog.ts: every field beyond the original four
is optional, and an absent `channels` means the post only ever went to the site.
"""

from __future__ import annotations

import os
import re
import sys
import unicodedata
from dataclasses import dataclass
from pathlib import Path
from typing import NoReturn

import frontmatter

REPO_ROOT = Path(__file__).resolve().parent.parent
POSTS_DIR = REPO_ROOT / "src" / "content" / "blog"
COVERS_DIR = REPO_ROOT / "public" / "covers"

DEFAULT_VAULT = Path.home() / "obsidian"

SITE_URL = "https://alexklos.ca"


@dataclass
class Post:
    slug: str
    title: str
    date: str
    description: str
    section: str
    channels: list[str]
    cover: str | None
    cover_alt: str | None
    cover_credit: str | None
    cover_credit_url: str | None
    # per-channel teaser copy; falls back to description
    linkedin: str | None
    body: str

    @property
    def url(self) -> str:
        return f"{SITE_URL}/blog/{self.slug}"

    @property
    def cover_path(self) -> Path | None:
        return COVERS_DIR / self.cover if self.cover else None


def every() -> list[Post]:
    """Every post, newest first. Unlike load() this doesn't validate covers —
    a listing shouldn't blow up because one post references a missing file."""
    posts = [_read(path) for path in POSTS_DIR.glob("*.md")]
    return sorted(posts, key=lambda p: p.date, reverse=True)


def load(slug: str) -> Post:
    path = POSTS_DIR / f"{slug}.md"
    if not path.exists():
        fail(f"no post at {path.relative_to(REPO_ROOT)}")

    post = _read(path)

    cover_path = post.cover_path
    if cover_path is not None and not cover_path.exists():
        fail(f"cover '{post.cover}' not found in public/covers/")

    return post


def _read(path: Path) -> Post:
    parsed = frontmatter.load(path)
    meta = parsed.metadata

    return Post(
        slug=path.stem,
        title=meta["title"],
        date=str(meta["date"]),
        description=meta.get("description", ""),
        section=meta.get("section", "tech"),
        channels=meta.get("channels", ["site"]),
        cover=meta.get("cover"),
        cover_alt=meta.get("coverAlt"),
        cover_credit=meta.get("coverCredit"),
        cover_credit_url=meta.get("coverCreditUrl"),
        linkedin=meta.get("linkedin"),
        body=parsed.content.strip(),
    )


def articles_dir(vault: Path | None = None) -> Path:
    """Where the Obsidian drafts live."""
    root = vault or Path(os.environ.get("OBSIDIAN_VAULT", DEFAULT_VAULT))
    return root / "Articles"


def drafts(vault: Path | None = None) -> list[Path]:
    """The folder note in each article directory — `<Name>/<Name>.md`. Every
    other note in there is research feeding the draft, not the draft."""
    articles = articles_dir(vault)
    if not articles.is_dir():
        return []

    found = []
    for directory in sorted(p for p in articles.iterdir() if p.is_dir()):
        note = directory / f"{directory.name}.md"
        if note.exists():
            found.append(note)
    return found


def slugify(title: str) -> str:
    """Close enough to github-slugger for filenames: drop accents and
    punctuation, collapse whitespace to hyphens."""
    ascii_only = (
        unicodedata.normalize("NFKD", title).encode("ascii", "ignore").decode()
    )
    cleaned = re.sub(r"[^\w\s-]", "", ascii_only).strip().lower()
    return re.sub(r"[-\s]+", "-", cleaned)


def draft_slug(note: Path) -> str:
    """A draft's slug comes from its title, falling back to the folder name for
    a draft that hasn't been given frontmatter yet."""
    title = frontmatter.load(note).metadata.get("title")
    return slugify(str(title) if title else note.parent.name)


def draft_for(slug: str, vault: Path | None = None) -> Path | None:
    """The vault draft a post is synced from, if there is one. Posts predating
    the vault don't have one, and are edited in the repo."""
    return next((n for n in drafts(vault) if draft_slug(n) == slug), None)


def _yaml_quote(value: str) -> str:
    return '"' + value.replace("\\", "\\\\").replace('"', '\\"') + '"'


def set_frontmatter(slug: str, values: dict[str, str]) -> Path:
    """Rewrite frontmatter keys in place, and say which file was written.

    Targets the vault draft, since that's the source of truth — the repo copy
    gets the change when the post is next synced. Falls back to the repo copy
    for posts with no draft.

    Deliberately textual rather than a YAML round-trip: dumping would reflow
    the whole block and mangle hand-written multi-line fields like `linkedin: |`.
    Block scalar content is indented, so matching keys at column zero is safe.
    """
    path = draft_for(slug) or POSTS_DIR / f"{slug}.md"
    lines = path.read_text().splitlines()

    if not lines or lines[0].strip() != "---":
        fail(f"{path.name} has no frontmatter block")

    try:
        closing = next(i for i, line in enumerate(lines[1:], 1) if line.strip() == "---")
    except StopIteration:
        fail(f"{path.name} has an unterminated frontmatter block")

    for key, value in values.items():
        replacement = f"{key}: {_yaml_quote(value)}"
        for index in range(1, closing):
            if lines[index].startswith(f"{key}:"):
                lines[index] = replacement
                break
        else:
            lines.insert(closing, replacement)
            closing += 1

    path.write_text("\n".join(lines) + "\n")
    return path


def require_channel(post: Post, channel: str) -> None:
    if channel not in post.channels:
        fail(
            f"'{post.slug}' has channels {post.channels}; "
            f"add '{channel}' to its frontmatter to syndicate there"
        )


def fail(message: str) -> NoReturn:
    print(f"error: {message}", file=sys.stderr)
    raise SystemExit(1)

"""Guided syndication: preflight, cover, preview, publish.

Wraps the single-purpose scripts rather than replacing them — you can still run
syndicate_substack.py or syndicate_linkedin.py directly when you know exactly
what you want.

Usage:
    python scripts/syndicate.py [slug]
"""

from __future__ import annotations

import argparse
import os
import subprocess
import sys
from pathlib import Path

import requests
from dotenv import load_dotenv

import post as postlib
from post import REPO_ROOT, fail

SCRIPTS = Path(__file__).resolve().parent
TARGETS = ["substack", "linkedin"]


def rule(title: str) -> None:
    print(f"\n\033[1m{title}\033[0m\n{'─' * max(len(title), 40)}")


def ask(question: str, default: bool = True) -> bool:
    suffix = "[Y/n]" if default else "[y/N]"
    answer = input(f"{question} {suffix} ").strip().lower()
    return default if not answer else answer in ("y", "yes")


def run(script: str, *args: str) -> int:
    return subprocess.call([sys.executable, str(SCRIPTS / script), *args])


def choose_slug() -> str:
    posts = {p.slug: p for p in postlib.every()}
    candidates = [
        p for p in posts.values() if any(t in p.channels for t in TARGETS)
    ]
    if not candidates:
        fail("no posts have substack or linkedin in their channels")

    print("Posts set up for syndication:\n")
    for index, item in enumerate(candidates, 1):
        channels = ",".join(c for c in item.channels if c in TARGETS)
        cover = "cover" if item.cover else "no cover"
        print(f"  {index}. {item.slug}  ({channels}; {cover})")

    raw = input("\nWhich? ").strip()
    if not raw.isdigit() or not 1 <= int(raw) <= len(candidates):
        fail("no post selected")
    return candidates[int(raw) - 1].slug


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("slug", nargs="?")
    parser.add_argument(
        "--dry-run", action="store_true", help="Preview only; never publish."
    )
    args = parser.parse_args()

    load_dotenv(REPO_ROOT / ".env")

    slug = args.slug or choose_slug()
    post = postlib.load(slug)

    targets = [t for t in TARGETS if t in post.channels]
    if not targets:
        fail(f"'{slug}' has channels {post.channels} — nothing to syndicate")

    rule(f"1. {post.title}")
    print(f"slug      {post.slug}")
    print(f"section   {post.section}")
    print(f"targets   {', '.join(targets)}")

    # --- live check: the backlink and the LinkedIn card both need the post up
    rule("2. Is it live?")
    try:
        response = requests.get(post.url, timeout=20)
        live = response.ok
    except requests.RequestException as error:
        live = False
        print(f"could not reach {post.url}: {error}")

    if live:
        print(f"ok        {post.url}")
    else:
        print(f"NOT LIVE  {post.url}")
        print("Deploy first, or the backlink and link preview will be broken.")
        if not ask("Continue anyway?", default=False):
            return

    # --- cover
    rule("3. Cover")
    if post.cover:
        print(f"ok        {post.cover}")
        if post.cover_credit:
            print(f"credit    {post.cover_credit}")
    else:
        print("none      Substack drafts get no cover; LinkedIn falls back to")
        print("          the generated OG card.")
        if ask("Pick one now?"):
            if run("cover_picker.py", slug) != 0:
                fail("cover picker failed")
            post = postlib.load(slug)  # reload: frontmatter changed
            print(f"\nok        {post.cover}")

    # --- copy
    rule("4. Copy")
    if "linkedin" in targets:
        if post.linkedin and post.linkedin.strip():
            first = post.linkedin.strip().splitlines()[0]
            print(f"linkedin  {first[:60]}{'...' if len(first) > 60 else ''}")
        else:
            print("linkedin  MISSING — will fall back to the description,")
            print("          which is a subtitle rather than post copy.")
            print("          Add a `linkedin:` block to the frontmatter.")
    print(f"subtitle  {post.description}")

    # --- credentials, before we bother rendering previews
    rule("5. Credentials")
    missing = []
    if "substack" in targets and not (
        os.getenv("PUBLICATION_URL")
        and (os.getenv("COOKIES_STRING") or os.getenv("COOKIES_PATH"))
    ):
        missing.append("substack (run scripts/substack_auth.py)")
    if "linkedin" in targets and not os.getenv("LINKEDIN_ACCESS_TOKEN"):
        missing.append("linkedin (run scripts/linkedin_auth.py)")

    if missing:
        for item in missing:
            print(f"missing   {item}")
        if not args.dry_run:
            fail("fix the above, then re-run")
    else:
        print("ok        all set")

    # --- preview
    rule("6. Preview")
    for target in targets:
        print(f"\n\033[1m{target}\033[0m")
        run(f"syndicate_{target}.py", slug, "--dry-run")

    if args.dry_run:
        print("\ndry run — stopping here")
        return

    # --- publish
    rule("7. Publish")
    print("Substack creates a draft you publish yourself.")
    if "linkedin" in targets:
        print("\033[1mLinkedIn posts immediately and cannot be undone.\033[0m")

    if not ask(f"Syndicate to {' and '.join(targets)}?", default=False):
        print("nothing sent")
        return

    failures = []
    for target in targets:  # substack first: a draft is recoverable
        print(f"\n\033[1m{target}\033[0m")
        if run(f"syndicate_{target}.py", slug) != 0:
            failures.append(target)

    rule("Done")
    for target in targets:
        print(f"{target:10} {'failed' if target in failures else 'ok'}")
    if "substack" in targets and "substack" not in failures:
        print("\nReview the Substack draft and publish it from their editor.")


if __name__ == "__main__":
    main()

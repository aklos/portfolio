"""Create a Substack draft from a post in src/content/blog.

Stops at draft on purpose: publishing on Substack emails the list, and this
rides on Substack's private API, so a run that goes wrong should cost a review
rather than a bad send. Publish from the Substack editor once it looks right.

Usage:
    python scripts/syndicate_substack.py <slug> [--dry-run]

Environment (.env at the repo root):
    PUBLICATION_URL   https://aklos.substack.com
    COOKIES_STRING    full `cookie` request header from a signed-in session
    or COOKIES_PATH   path to a cookies JSON file
"""

from __future__ import annotations

import argparse
import os

from dotenv import load_dotenv

import post as postlib
from post import REPO_ROOT, fail

CHANNEL = "substack"


UNSPLASH_HOME = "https://unsplash.com/?utm_source=alexklos&utm_medium=referral"


def backlink(post: postlib.Post) -> str:
    """The site stays canonical; Substack has no rel=canonical control, so the
    attribution line is the practical version. The photo credit rides along
    because the cover runs on Substack too."""
    lines = [f"*Originally published at [alexklos.ca]({post.url}).*"]

    if post.cover_credit:
        credit = post.cover_credit
        if post.cover_credit_url:
            credit = f"[{credit}]({post.cover_credit_url})"
        lines.append(f"*Cover photo by {credit} on [Unsplash]({UNSPLASH_HOME}).*")

    return "\n\n".join(lines)


def resolve_section_id(api, section: str) -> int | None:
    sections = api.get_sections() or []
    for candidate in sections:
        if str(candidate.get("name", "")).strip().lower() == section.strip().lower():
            return candidate.get("id")

    names = ", ".join(str(s.get("name")) for s in sections) or "none"
    print(
        f"warning: no Substack section named '{section}' (available: {names}); "
        "creating the draft without one"
    )
    return None


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("slug")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be sent without contacting Substack.",
    )
    args = parser.parse_args()

    load_dotenv(REPO_ROOT / ".env")

    post = postlib.load(args.slug)
    postlib.require_channel(post, CHANNEL)

    markdown = f"{post.body}\n\n---\n\n{backlink(post)}"

    if args.dry_run:
        print(f"slug       {post.slug}")
        print(f"title      {post.title}")
        print(f"subtitle   {post.description}")
        print(f"section    {post.section}")
        print(f"cover      {post.cover or '(none — Substack draft gets no cover)'}")
        print(f"backlink   {post.url}")
        print(f"body       {len(markdown)} chars, ending:\n\n...{markdown[-200:]}")
        return

    publication_url = os.getenv("PUBLICATION_URL")
    if not publication_url:
        fail("PUBLICATION_URL is not set (see .env.example)")
    if not (os.getenv("COOKIES_STRING") or os.getenv("COOKIES_PATH")):
        fail("set COOKIES_STRING or COOKIES_PATH (see .env.example)")

    from substack import Api

    api = Api(
        cookies_string=os.getenv("COOKIES_STRING"),
        cookies_path=os.getenv("COOKIES_PATH"),
        publication_url=publication_url,
    )

    draft = api.create_draft_from_markdown(
        title=post.title,
        subtitle=post.description,
        markdown=markdown,
        slug=post.slug,
        draft_section_id=resolve_section_id(api, post.section),
        search_engine_description=post.description,
    )

    draft_id = draft.get("id")
    if not draft_id:
        fail(f"Substack did not return a draft id: {draft}")

    # cover isn't part of the draft payload, so it's uploaded and attached after
    if post.cover:
        uploaded = api.get_image(str(post.cover_path))
        cover_url = uploaded.get("url")
        if cover_url:
            api.put_draft(draft_id, cover_image=cover_url)
            print(f"cover      uploaded {post.cover}")
        else:
            print(f"warning: cover upload returned no url: {uploaded}")

    print(f"draft      {publication_url.rstrip('/')}/publish/post/{draft_id}")
    print("Review it in Substack, then publish from there.")


if __name__ == "__main__":
    main()

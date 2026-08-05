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


def fetch_sections(api) -> list[dict]:
    """Not `api.get_sections()`: that reads /subscriptions — the publications you
    subscribe to — and hunts for your own in the list. Yours isn't in there, and
    Substack has since made the endpoint 400 without a `tvOnly` param. This is
    the endpoint that answers the question, and it returns [] until sections
    exist."""
    response = api._session.get(f"{api.publication_url}/publication/sections")
    if not response.ok:
        print(f"warning: could not list Substack sections ({response.status_code})")
        return []
    sections = response.json()
    return sections if isinstance(sections, list) else []


def resolve_section_id(api, section: str) -> int | None:
    sections = fetch_sections(api)
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

    # `or None` matters: the Api picks its auth branch with `is not None`, so an
    # unused-but-present `COOKIES_PATH=` in .env sends it down the file branch
    # and it opens "" instead of reading COOKIES_STRING.
    api = Api(
        cookies_string=os.getenv("COOKIES_STRING") or None,
        cookies_path=os.getenv("COOKIES_PATH") or None,
        publication_url=publication_url,
    )

    result = api.create_draft_from_markdown(
        title=post.title,
        subtitle=post.description,
        markdown=markdown,
        slug=post.slug,
        draft_section_id=resolve_section_id(api, post.section),
        search_engine_description=post.description,
    )

    # the draft comes back wrapped alongside tags/prepublish/publish results;
    # the `or result` keeps this working if that wrapper ever goes away
    draft = result.get("draft") or result
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

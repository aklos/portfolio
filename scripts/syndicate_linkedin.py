"""Share a post to LinkedIn as an article link with a thumbnail.

LinkedIn Articles (long-form) cannot be created through the API — only through
the web editor — so this creates a feed post whose content is a link back to
alexklos.ca. The Posts API also refuses to scrape the URL, so the title,
description and thumbnail are all supplied explicitly.

Usage:
    python scripts/syndicate_linkedin.py <slug> [--dry-run]

Environment (.env at the repo root):
    LINKEDIN_ACCESS_TOKEN   from scripts/linkedin_auth.py
    LINKEDIN_AUTHOR_URN     optional; looked up from /v2/userinfo when absent
"""

from __future__ import annotations

import argparse
import os
from typing import NoReturn

import requests
from dotenv import load_dotenv

import post as postlib
from post import REPO_ROOT, fail

CHANNEL = "linkedin"
API = "https://api.linkedin.com/rest"
# LinkedIn requires an explicit version; bump this deliberately, not automatically
LINKEDIN_VERSION = "202607"
TIMEOUT = 60


def api_fail(what: str, response: requests.Response) -> NoReturn:
    """A 401 here almost always means the 60-day token lapsed, which is worth
    saying plainly rather than dumping LinkedIn's error body."""
    if response.status_code == 401:
        fail(
            f"{what}: access token expired or revoked — "
            "run 'python scripts/linkedin_auth.py' to mint a new one"
        )
    fail(f"{what} ({response.status_code}): {response.text}")


# LinkedIn collapses the commentary behind "…see more" at roughly this point.
# It varies by client, so treat it as a guide for where the hook has to land.
FOLD = 200


def show_commentary(text: str) -> None:
    print(f"\ncommentary  ({len(text)} chars)\n")
    if len(text) <= FOLD:
        print(text)
        return

    print(text[:FOLD])
    print(f"{'─' * 20} fold: …see more {'─' * 20}")
    print(text[FOLD:])


def headers(token: str) -> dict[str, str]:
    return {
        "Authorization": f"Bearer {token}",
        "X-Restli-Protocol-Version": "2.0.0",
        "LinkedIn-Version": LINKEDIN_VERSION,
        "Content-Type": "application/json",
    }


def author_urn(token: str) -> str:
    """The member id comes from the OIDC userinfo `sub` claim."""
    response = requests.get(
        "https://api.linkedin.com/v2/userinfo",
        headers={"Authorization": f"Bearer {token}"},
        timeout=TIMEOUT,
    )
    if not response.ok:
        api_fail("could not read userinfo", response)
    return f"urn:li:person:{response.json()['sub']}"


def thumbnail_bytes(post: postlib.Post) -> tuple[bytes, str]:
    """The chosen cover if there is one, otherwise the generated OG card from
    the live site — which is why the post must be deployed before syndicating."""
    cover_path = post.cover_path
    if cover_path is not None:
        return cover_path.read_bytes(), f"cover {post.cover}"

    url = f"{post.url}/opengraph-image"
    response = requests.get(url, timeout=TIMEOUT)
    if not response.ok:
        fail(
            f"no cover set and the generated card at {url} returned "
            f"{response.status_code} — is the post deployed?"
        )
    return response.content, "generated OG card"


def upload_image(token: str, owner: str, data: bytes) -> str:
    """initializeUpload reserves the URN, then the bytes go to the returned URL."""
    init = requests.post(
        f"{API}/images?action=initializeUpload",
        headers=headers(token),
        json={"initializeUploadRequest": {"owner": owner}},
        timeout=TIMEOUT,
    )
    if not init.ok:
        api_fail("image initializeUpload failed", init)

    value = init.json()["value"]
    upload = requests.put(
        value["uploadUrl"],
        headers={"Authorization": f"Bearer {token}"},
        data=data,
        timeout=TIMEOUT,
    )
    if not upload.ok:
        api_fail("image upload failed", upload)

    return value["image"]


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("slug")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be posted without contacting LinkedIn.",
    )
    args = parser.parse_args()

    load_dotenv(REPO_ROOT / ".env")

    post = postlib.load(args.slug)
    postlib.require_channel(post, CHANNEL)

    commentary = (post.linkedin or "").strip()
    if not commentary:
        commentary = post.description
        print(
            "warning: no `linkedin:` in frontmatter — falling back to the "
            "description, which is a subtitle rather than post copy"
        )

    if args.dry_run:
        print(f"slug        {post.slug}")
        print(f"author      {os.getenv('LINKEDIN_AUTHOR_URN') or '(from userinfo)'}")
        print(f"link        {post.url}")
        print(f"title       {post.title}")
        print(f"description {post.description}")
        print(f"thumbnail   {post.cover or '(generated OG card from the live site)'}")
        show_commentary(commentary)
        return

    token = os.getenv("LINKEDIN_ACCESS_TOKEN")
    if not token:
        fail("LINKEDIN_ACCESS_TOKEN is not set — run scripts/linkedin_auth.py")

    owner = os.getenv("LINKEDIN_AUTHOR_URN") or author_urn(token)

    data, source = thumbnail_bytes(post)
    thumbnail = upload_image(token, owner, data)
    print(f"thumbnail   uploaded {source} -> {thumbnail}")

    response = requests.post(
        f"{API}/posts",
        headers=headers(token),
        json={
            "author": owner,
            "commentary": commentary,
            "visibility": "PUBLIC",
            "distribution": {
                "feedDistribution": "MAIN_FEED",
                "targetEntities": [],
                "thirdPartyDistributionChannels": [],
            },
            "content": {
                "article": {
                    "source": post.url,
                    "thumbnail": thumbnail,
                    "title": post.title,
                    "description": post.description,
                }
            },
            "lifecycleState": "PUBLISHED",
            "isReshareDisabledByAuthor": False,
        },
        timeout=TIMEOUT,
    )
    if response.status_code != 201:
        api_fail("post creation failed", response)

    post_urn = response.headers.get("x-restli-id", "")
    print(f"posted      https://www.linkedin.com/feed/update/{post_urn}/")


if __name__ == "__main__":
    main()

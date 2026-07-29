"""Capture and verify a Substack session, then store it.

Substack has no publishing API, so syndication rides on a signed-in browser
session. By default this reads the session cookie straight out of your browser;
failing that it accepts a pasted cookie header or a devtools JSON export. Either
way it proves the session works before saving it, and reports which sections
exist — syndicate_substack.py matches a post's `section` against them by name.

Usage:
    python scripts/substack_auth.py                    # read from the browser
    python scripts/substack_auth.py --browser firefox  # a specific browser
    python scripts/substack_auth.py --paste            # paste it yourself
    python scripts/substack_auth.py --from-file c.json # devtools export

Reading from the browser needs the local-only extra:
    pip install -r scripts/requirements-auth.txt
"""

from __future__ import annotations

import argparse
import json
import os
from getpass import getpass
from pathlib import Path

from dotenv import load_dotenv

from env_store import offer_secrets, update_env
from post import REPO_ROOT, fail

COOKIE_DOMAIN = "substack.com"
SESSION_COOKIE = "substack.sid"

# Tried in order for --browser auto. browser_cookie3.load() can't be used for
# this: it throws on the first browser that isn't installed rather than
# skipping it.
BROWSERS = [
    "firefox",
    "librewolf",
    "chrome",
    "chromium",
    "brave",
    "edge",
    "vivaldi",
    "opera",
]

# The sections syndicate_substack.py expects to find, per the frontmatter schema
EXPECTED_SECTIONS = ["tech", "culture", "fiction"]


def from_browser(browser: str) -> str | None:
    """Read cookies from the local browser store. browser_cookie3 copies the
    database first, so this works with the browser still open."""
    try:
        import browser_cookie3
    except ImportError:
        print(
            "browser-cookie3 not installed — "
            "pip install -r scripts/requirements-auth.txt"
        )
        return None

    if browser != "auto" and not hasattr(browser_cookie3, browser):
        fail(f"unknown browser '{browser}'")

    candidates = BROWSERS if browser == "auto" else [browser]
    explicit = browser != "auto"

    for name in candidates:
        loader = getattr(browser_cookie3, name, None)
        if loader is None:
            continue

        try:
            jar = list(loader(domain_name=COOKIE_DOMAIN))
        except Exception as error:
            # An uninstalled browser is normal when scanning; only worth
            # reporting when it's the one that was asked for.
            if explicit:
                print(f"could not read cookies from {name}: {error}")
            continue

        pairs = {cookie.name: cookie.value for cookie in jar}
        if SESSION_COOKIE not in pairs:
            if explicit:
                print(
                    f"no {SESSION_COOKIE} cookie in {name} — "
                    "are you signed in to Substack there?"
                )
            continue

        print(f"read {len(pairs)} substack.com cookie(s) from {name}")
        return "; ".join(f"{key}={value}" for key, value in pairs.items())

    if not explicit:
        print(
            "no signed-in Substack session found in any browser "
            "(try --diagnose to see what was checked)"
        )
    return None


def diagnose() -> None:
    """Which browsers hold substack cookies at all. Prints hosts and counts
    only — never values."""
    try:
        import browser_cookie3
    except ImportError:
        fail("browser-cookie3 not installed — pip install -r scripts/requirements-auth.txt")

    candidates = [
        "firefox",
        "librewolf",
        "chrome",
        "chromium",
        "brave",
        "edge",
        "vivaldi",
        "opera",
    ]

    for name in candidates:
        loader = getattr(browser_cookie3, name, None)
        if loader is None:
            continue
        try:
            jar = list(loader())
        except Exception as error:
            print(f"{name:10} unavailable ({type(error).__name__})")
            continue

        hosts = {c.domain for c in jar if "substack" in c.domain}
        names = {c.name for c in jar if "substack" in c.domain}
        marker = "<- has session" if SESSION_COOKIE in names else ""
        print(
            f"{name:10} {len(jar):5} cookies, "
            f"substack hosts: {sorted(hosts) or 'none'} {marker}"
        )

    print(
        "\nIf a browser holds the session but reading it failed, try closing "
        "that browser first — recent cookies can sit in the write-ahead log "
        "rather than the main database. Cookies from a private window are "
        "never written to disk at all."
    )


def normalize(raw: str) -> str:
    """Accept either a raw `cookie` header or the JSON devtools puts on your
    clipboard, which nests values under a "Request/Response Cookies" key."""
    raw = raw.strip()
    if not raw.startswith(("{", "[")):
        return raw

    try:
        data = json.loads(raw)
    except json.JSONDecodeError as error:
        fail(f"looks like JSON but wouldn't parse: {error}")

    pairs: dict[str, str] = {}

    def absorb(obj) -> None:
        if isinstance(obj, list):
            for item in obj:
                if isinstance(item, dict) and "name" in item:
                    pairs[item["name"]] = item.get("value", "")
            return
        if not isinstance(obj, dict):
            return
        for key, value in obj.items():
            if isinstance(value, dict) and "value" in value:
                pairs[key] = value["value"]
            elif isinstance(value, str):
                pairs[key] = value
            else:
                absorb(value)  # a devtools wrapper key

    absorb(data)
    if not pairs:
        fail("found no cookies in that JSON")

    print(f"parsed {len(pairs)} cookie(s): {', '.join(pairs)}")
    return "; ".join(f"{name}={value}" for name, value in pairs.items())


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--publication-url", help="Defaults to PUBLICATION_URL in .env.")
    parser.add_argument(
        "--browser",
        default="auto",
        help="auto (default), firefox, chrome, chromium, brave, edge, safari.",
    )
    parser.add_argument(
        "--paste", action="store_true", help="Paste the cookie instead of reading it."
    )
    parser.add_argument("--from-file", help="Read a cookie header or devtools JSON.")
    parser.add_argument(
        "--diagnose",
        action="store_true",
        help="Report which browsers hold substack cookies, then exit.",
    )
    parser.add_argument(
        "--no-env", action="store_true", help="Don't write the cookie to .env."
    )
    parser.add_argument(
        "--no-secrets",
        action="store_true",
        help="Don't offer to set the GitHub repository secrets.",
    )
    parser.add_argument(
        "--yes", action="store_true", help="Set repository secrets without asking."
    )
    args = parser.parse_args()

    if args.diagnose:
        diagnose()
        return

    load_dotenv(REPO_ROOT / ".env")

    publication_url = args.publication_url or os.getenv("PUBLICATION_URL")
    if not publication_url:
        publication_url = input("Publication URL: ").strip()
    if not publication_url:
        fail("a publication URL is required")
    print(f"Publication: {publication_url}")

    cookies_string = None
    if args.from_file:
        cookies_string = normalize(Path(args.from_file).read_text())
    elif not args.paste:
        cookies_string = from_browser(args.browser)

    if not cookies_string:
        print("\nPaste the `cookie` request header or devtools JSON (hidden):")
        cookies_string = normalize(getpass("cookie: "))
    if not cookies_string:
        fail("no cookie provided")

    from substack import Api

    try:
        api = Api(cookies_string=cookies_string, publication_url=publication_url)
        user_id = api.get_user_id()
    except Exception as error:  # the client raises a variety of types
        fail(
            f"could not authenticate with that cookie: {error}\n"
            "Make sure the session is current and covers this publication."
        )

    print(f"\nauthenticated as user {user_id}")

    try:
        print(f"subscribers {api.get_publication_subscriber_count()}")
    except Exception:
        pass  # informational only

    # Section ids are what the syndication script actually needs to resolve
    try:
        sections = api.get_sections() or []
    except Exception as error:
        print(f"warning: could not list sections: {error}")
        sections = []

    if sections:
        print("\nsections:")
        for section in sections:
            print(f"  {section.get('name')} (id {section.get('id')})")
    else:
        print("\nno sections defined on this publication")

    found = {str(s.get("name", "")).strip().lower() for s in sections}
    missing = [name for name in EXPECTED_SECTIONS if name not in found]
    if missing:
        print(
            f"\nnote: no section named {', '.join(missing)} — posts in those "
            "sections will be drafted without one. Create them in Substack "
            "under Settings > Sections if you want the split."
        )

    values = {"PUBLICATION_URL": publication_url, "COOKIES_STRING": cookies_string}

    if args.no_env:
        print("\n(not writing .env)")
    else:
        update_env(values)

    if args.no_secrets:
        return

    offer_secrets(values, args.yes)


if __name__ == "__main__":
    main()

"""One-time LinkedIn OAuth helper — run this to mint an access token.

LinkedIn member tokens last 60 days, so this needs re-running every couple of
months. Refresh tokens are not granted to every app, so the token printed here
is the thing to keep.

Setup, once:
  1. Create an app at https://www.linkedin.com/developers/apps
  2. Add the "Sign In with LinkedIn using OpenID Connect" and
     "Share on LinkedIn" products (both self-serve, no review)
  3. Under Auth, add this redirect URL: http://localhost:8000/callback
  4. Put the client id and secret in .env, then run:

     python scripts/linkedin_auth.py
"""

from __future__ import annotations

import argparse
import os
import urllib.parse
import webbrowser
from http.server import BaseHTTPRequestHandler, HTTPServer

import requests
from dotenv import load_dotenv

from env_store import offer_secrets, update_env
from post import REPO_ROOT, fail

REDIRECT_URI = "http://localhost:8000/callback"
SCOPES = "openid profile w_member_social"
AUTH_URL = "https://www.linkedin.com/oauth/v2/authorization"
TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken"

received: dict[str, str] = {}


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        query = urllib.parse.urlparse(self.path).query
        received.update({k: v[0] for k, v in urllib.parse.parse_qs(query).items()})

        self.send_response(200)
        self.send_header("Content-Type", "text/plain")
        self.end_headers()
        ok = "code" in received
        self.wfile.write(
            b"Authorized. Back to the terminal."
            if ok
            else b"No code in callback - check the terminal."
        )

    def log_message(self, format, *args):  # noqa: A002 - matches base signature
        pass  # keep the console clean


def author_urn(token: str) -> str | None:
    """Stored alongside the token so syndication runs skip this lookup."""
    response = requests.get(
        "https://api.linkedin.com/v2/userinfo",
        headers={"Authorization": f"Bearer {token}"},
        timeout=30,
    )
    if not response.ok:
        print(f"warning: could not read userinfo ({response.status_code})")
        return None
    return f"urn:li:person:{response.json()['sub']}"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--no-env", action="store_true", help="Don't write the token to .env."
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

    load_dotenv(REPO_ROOT / ".env")

    client_id = os.getenv("LINKEDIN_CLIENT_ID")
    client_secret = os.getenv("LINKEDIN_CLIENT_SECRET")
    if not client_id or not client_secret:
        fail("set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET in .env")

    params = urllib.parse.urlencode(
        {
            "response_type": "code",
            "client_id": client_id,
            "redirect_uri": REDIRECT_URI,
            "scope": SCOPES,
            "state": "syndicate",
        }
    )
    url = f"{AUTH_URL}?{params}"

    print("Opening LinkedIn authorization. If nothing opens, visit:\n")
    print(f"  {url}\n")
    webbrowser.open(url)

    server = HTTPServer(("localhost", 8000), Handler)
    server.handle_request()
    server.server_close()

    if "code" not in received:
        fail(f"authorization failed: {received}")

    response = requests.post(
        TOKEN_URL,
        data={
            "grant_type": "authorization_code",
            "code": received["code"],
            "client_id": client_id,
            "client_secret": client_secret,
            "redirect_uri": REDIRECT_URI,
        },
        timeout=30,
    )
    if not response.ok:
        fail(f"token exchange failed ({response.status_code}): {response.text}")

    payload = response.json()
    days = int(payload.get("expires_in", 0)) // 86400
    token = payload["access_token"]

    values = {"LINKEDIN_ACCESS_TOKEN": token}
    if "refresh_token" in payload:
        values["LINKEDIN_REFRESH_TOKEN"] = payload["refresh_token"]
    else:
        print(
            "\nNo refresh token issued — expected, since those are limited to "
            "approved Marketing Developer Platform partners."
        )

    urn = author_urn(token)
    if urn:
        values["LINKEDIN_AUTHOR_URN"] = urn

    print(f"\nAccess token obtained, expires in ~{days} days.")

    if args.no_env:
        for key, value in values.items():
            print(f"{key}={value}")
    else:
        update_env(values)

    if args.no_secrets:
        return

    # These are the same values the Syndicate workflow needs, so offer to
    # push them straight to the repo rather than copy them by hand.
    offer_secrets(values, args.yes)


if __name__ == "__main__":
    main()

"""Check how much life is left in the LinkedIn access token.

Member tokens last 60 days and LinkedIn only issues refresh tokens to approved
Marketing Developer Platform partners, so the self-serve path means re-running
scripts/linkedin_auth.py periodically. This exists so that lands as a warning
ahead of time rather than a failed syndication run.

Usage:
    python scripts/linkedin_token_check.py [--warn-days 14]

Exits 0 whether the token is healthy or not — the status is on stdout and, in
Actions, in GITHUB_OUTPUT. Only a misconfiguration exits non-zero.
"""

from __future__ import annotations

import argparse
import os
import time
from pathlib import Path

import requests
from dotenv import load_dotenv

from post import REPO_ROOT, fail

INTROSPECT_URL = "https://www.linkedin.com/oauth/v2/introspectToken"
TIMEOUT = 30


def emit(status: str, days: int | None, message: str) -> None:
    print(f"status  {status}")
    if days is not None:
        print(f"days    {days}")
    print(f"message {message}")

    output = os.getenv("GITHUB_OUTPUT")
    if output:
        with Path(output).open("a") as handle:
            handle.write(f"status={status}\n")
            handle.write(f"days={days if days is not None else ''}\n")
            handle.write(f"message={message}\n")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--warn-days",
        type=int,
        default=14,
        help="Warn when fewer than this many days remain (default: 14).",
    )
    args = parser.parse_args()

    load_dotenv(REPO_ROOT / ".env")

    client_id = os.getenv("LINKEDIN_CLIENT_ID")
    client_secret = os.getenv("LINKEDIN_CLIENT_SECRET")
    token = os.getenv("LINKEDIN_ACCESS_TOKEN")
    if not (client_id and client_secret and token):
        fail(
            "need LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET and "
            "LINKEDIN_ACCESS_TOKEN to introspect the token"
        )

    response = requests.post(
        INTROSPECT_URL,
        data={
            "client_id": client_id,
            "client_secret": client_secret,
            "token": token,
        },
        timeout=TIMEOUT,
    )
    if not response.ok:
        # 400 is a bad token, 401 a bad secret — both need a human either way
        emit(
            "expired",
            None,
            f"Token introspection failed ({response.status_code}). The token is "
            "likely invalid or revoked. Run scripts/linkedin_auth.py.",
        )
        return

    payload = response.json()

    if not payload.get("active"):
        emit(
            "expired",
            0,
            f"LinkedIn token is {payload.get('status', 'inactive')}. "
            "Run scripts/linkedin_auth.py and update LINKEDIN_ACCESS_TOKEN.",
        )
        return

    expires_at = payload.get("expires_at")
    if not expires_at:
        emit("ok", None, "Token is active; LinkedIn returned no expiry.")
        return

    days = int((expires_at - time.time()) // 86400)

    if days <= args.warn_days:
        emit(
            "warn",
            days,
            f"LinkedIn token expires in {days} day(s). Run "
            "scripts/linkedin_auth.py and update LINKEDIN_ACCESS_TOKEN.",
        )
    else:
        emit("ok", days, f"Token is active for another {days} day(s).")


if __name__ == "__main__":
    main()

"""Writing credentials to .env and to GitHub repository secrets.

Shared by the two auth scripts so a token or cookie only ever has to be pasted
once, into one place.
"""

from __future__ import annotations

import shutil
import subprocess

from post import REPO_ROOT


def update_env(values: dict[str, str]) -> None:
    """Replace existing keys in place, append new ones, leave the rest alone."""
    path = REPO_ROOT / ".env"
    lines = path.read_text().splitlines() if path.exists() else []

    for key, value in values.items():
        replacement = f"{key}={value}"
        for index, line in enumerate(lines):
            if line.startswith(f"{key}="):
                lines[index] = replacement
                break
        else:
            lines.append(replacement)

    path.write_text("\n".join(lines) + "\n")
    path.chmod(0o600)
    print(f"\nwrote {', '.join(values)} to .env")


def set_secrets(values: dict[str, str]) -> None:
    """Piped through stdin rather than argv so secrets never land in the
    process list."""
    if not shutil.which("gh"):
        print("gh not installed — set the repository secrets manually")
        return

    for key, value in values.items():
        result = subprocess.run(
            ["gh", "secret", "set", key],
            input=value.encode(),
            cwd=REPO_ROOT,
            capture_output=True,
        )
        if result.returncode == 0:
            print(f"set repository secret {key}")
        else:
            print(f"could not set {key}: {result.stderr.decode().strip()}")


def offer_secrets(values: dict[str, str], yes: bool) -> None:
    if yes:
        set_secrets(values)
        return

    answer = input("\nSet these as GitHub repository secrets too? [Y/n] ").strip()
    if answer.lower() in ("", "y", "yes"):
        set_secrets(values)

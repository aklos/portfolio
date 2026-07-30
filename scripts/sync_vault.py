"""Sync article drafts from the Obsidian vault into src/content/blog.

One-way, vault to repo: the draft is the source of truth for the prose and the
whole frontmatter block, so edits belong in Obsidian and this script carries
them over. That holds for the scripts too — cover_picker.py writes the cover
fields into the draft, not into the copy here.

A draft only syncs once src/content/blog/<slug>.md exists. Creating that file
is how a finished article opts in; until then the draft is invisible to the
site no matter what's in its frontmatter.

Usage:
    python scripts/sync_vault.py [slug ...] [--dry-run]
"""

from __future__ import annotations

import argparse
import re
from datetime import date
from pathlib import Path

import post as postlib
from post import DEFAULT_VAULT, POSTS_DIR, REPO_ROOT, fail

# hand-written fields a synced draft needs, in the order the README lists them.
# `toc` is deliberately absent: it's opt-in, so an unscaffolded draft is right.
# The cover fields aren't here either — cover_picker.py writes those when there
# is a cover to write, and they sync like anything else once it has.
SCAFFOLD = ("title", "date", "description", "section", "channels", "linkedin")


def split_frontmatter(text: str) -> tuple[list[str] | None, str]:
    """Return the frontmatter lines (without the fences) and the body.

    Textual rather than a YAML round-trip, for the same reason post.py is:
    dumping reflows the block and mangles hand-written `linkedin: |` scalars.
    """
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return None, text

    try:
        closing = next(i for i, line in enumerate(lines[1:], 1) if line.strip() == "---")
    except StopIteration:
        raise ValueError("unterminated frontmatter block")

    return lines[1:closing], "\n".join(lines[closing + 1 :])


def key_spans(lines: list[str]) -> dict[str, list[str]]:
    """Map each column-zero key to its full textual span, so a block scalar
    comes along with the indented lines underneath it."""
    spans: dict[str, list[str]] = {}
    current: str | None = None

    for line in lines:
        if re.match(r"[A-Za-z_][\w-]*:", line):
            current = line.split(":", 1)[0]
            spans[current] = [line]
        elif current is not None:
            spans[current].append(line)

    return spans


def scaffold_lines(
    draft_spans: dict[str, list[str]],
    post_spans: dict[str, list[str]],
    title: str,
) -> list[str]:
    """Frontmatter the draft is missing, seeded from the repo copy where it has
    a value — so the first sync of an existing post migrates its frontmatter
    into the vault instead of inventing new values."""
    defaults = {
        "title": f'title: "{title}"',
        "date": f'date: "{date.today().isoformat()}"',
        "description": 'description: ""',
        "section": "section: tech",
        "channels": "channels: [site]",
        "linkedin": "linkedin:",
    }

    added: list[str] = []

    # whatever the repo copy already carries moves into the vault, in its own
    # order — including a cover picked back when the repo copy owned that
    for key, span in post_spans.items():
        if key not in draft_spans:
            added.extend(span)

    # then the hand-written fields a synced post is expected to have
    for key in SCAFFOLD:
        if key not in draft_spans and key not in post_spans:
            added.append(defaults[key])

    return added


def warnings(body: str) -> list[str]:
    """Obsidian-isms that won't render on the site. Worth saying out loud, not
    worth refusing the sync over."""
    found = []

    markers = re.findall(r"==([^=\n]+)==", body)
    if markers:
        found.append(
            f"{len(markers)} unresolved ==marker== "
            f'(first: "{markers[0][:60]}")'
        )

    links = re.findall(r"!?\[\[([^\]\n]+)\]\]", body)
    if links:
        found.append(
            f"{len(links)} wikilink/embed that won't render "
            f'(first: "{links[0][:60]}")'
        )

    return found


def report(status: str, message: str) -> None:
    print(f"  {status:<12} {message}")


def detail(message: str) -> None:
    print(f"{'':<14} {message}")


def render(block: list[str], body: str) -> str:
    """A synced post is byte-identical to its draft, so both are written from
    the same rendering."""
    return "---\n" + "\n".join(block) + "\n---\n\n" + body.strip() + "\n"


def sync_note(note: Path, dry_run: bool = False) -> bool:
    """Sync one draft into src/content/blog, reporting as it goes. True if the
    repo copy changed."""
    slug = postlib.draft_slug(note)

    try:
        draft_block, draft_body = split_frontmatter(note.read_text())
    except ValueError as error:
        report("error", f"{note.parent.name} — {error}")
        return False

    target = POSTS_DIR / f"{slug}.md"
    if not target.exists():
        report("skipped", f"{slug} — no {target.relative_to(REPO_ROOT)}")
        return False

    draft_spans = key_spans(draft_block or [])
    post_block, _ = split_frontmatter(target.read_text())

    added = scaffold_lines(draft_spans, key_spans(post_block or []), note.parent.name)
    merged = render((draft_block or []) + added, draft_body)

    changed = merged != target.read_text()
    if not dry_run:
        if added:
            note.write_text(merged)
        if changed:
            target.write_text(merged)

    if changed:
        report("would sync" if dry_run else "synced", slug)
    else:
        report("up to date", slug)

    if added:
        verb = "would add" if dry_run else "added"
        detail(f"{verb} {', '.join(key_spans(added))} to the draft — fill them in Obsidian")

    for warning in warnings(draft_body):
        detail(f"warning: {warning}")

    return changed


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("slugs", nargs="*", help="only sync these slugs")
    parser.add_argument(
        "--vault",
        type=Path,
        help=f"vault root (default $OBSIDIAN_VAULT, else {DEFAULT_VAULT})",
    )
    parser.add_argument(
        "--dry-run", action="store_true", help="report changes without writing"
    )
    args = parser.parse_args()

    notes = postlib.drafts(args.vault)
    if not notes:
        fail(f"no article drafts in {postlib.articles_dir(args.vault)}")

    synced = 0
    matched = set()

    for note in notes:
        slug = postlib.draft_slug(note)
        if args.slugs and slug not in args.slugs:
            continue

        matched.add(slug)
        synced += sync_note(note, args.dry_run)

    missing = set(args.slugs) - matched
    if missing:
        fail(f"no draft in the vault slugifies to: {', '.join(sorted(missing))}")

    if args.dry_run and synced:
        print("\ndry run — nothing written. Re-run without --dry-run to sync.")


if __name__ == "__main__":
    main()

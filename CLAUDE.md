# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`alexklos.ca` — a Next.js portfolio and blog deployed to Fly. `pnpm dev` to run
it, `pnpm build` to check it compiles. The Python in `scripts/` is separate
tooling for covers and syndication, run from `.venv`.

## Posts are synced, not edited here

`src/content/blog/*.md` is a **synced copy**. The source of truth is the
Obsidian vault at `~/obsidian`, where each article is a folder note:
`Articles/<Name>/<Name>.md`.

Never edit a file in `src/content/blog/` — prose or frontmatter. The next sync
overwrites it and the edit is lost. To change a post, edit the draft in the
vault and run:

```bash
.venv/bin/python scripts/sync_vault.py [slug] [--dry-run]
```

The draft owns the whole file: prose and every frontmatter field. After a sync
the two are byte-identical. That applies to tooling as well — anything writing
frontmatter goes through `post.set_frontmatter`, which targets the draft, and
then syncs the post through. `cover_picker.py` works this way.

Two things still happen repo-side:

- Creating `src/content/blog/<slug>.md` is how a finished draft opts into being
  synced at all. Until that file exists the draft is skipped, whatever its
  frontmatter says. The slug is the slugified title.
- A post with no draft in the vault is edited here: `set_frontmatter` falls
  back to the repo copy and the sync leaves it alone. Every post has a draft
  today, so this is only a fallback.

The sync scaffolds any frontmatter a draft is missing, seeding it from the repo
copy where that already has a value, so an existing post migrates into the
vault on its first sync rather than losing fields.

## Publishing

Deploy, then syndicate — the Substack backlink and LinkedIn link card both
point at the live post. `scripts/syndicate.py` walks the whole thing; the
per-channel scripts run one at a time. All of them take `--dry-run`. See the
README for credentials, which live in `.env` and in GitHub repository secrets.

Substack stops at a draft; LinkedIn posts immediately.

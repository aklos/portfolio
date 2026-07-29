# alexklos.ca

Next.js portfolio and blog, deployed to Fly.

```bash
pnpm dev      # http://localhost:3000
pnpm build
```

## Writing

Posts are markdown in `src/content/blog/`. The filename is the slug.

```yaml
---
title: "How Do We Stop Vibe Coding?"
date: "2026-07-24"
description: "Spoiler: we don't — we fix the trust problem instead."
toc: true                              # optional table of contents
section: tech                          # tech | culture | fiction
channels: [site, substack, linkedin]   # where it gets published
cover: koala.jpg                       # written by the cover picker
coverAlt: "A koala behind glass"
coverCredit: "Jane Doe"                # Unsplash attribution, if applicable
coverCreditUrl: "https://unsplash.com/@janedoe?utm_source=alexklos&utm_medium=referral"
linkedin: |                            # the LinkedIn post copy, written per post
  The hook, in a few short lines. The first ~200 characters
  land above LinkedIn's "…see more" fold.
---
```

Everything below `description` is optional. Omitted, a post behaves as
`section: tech` and `channels: [site]` — site only, which is how the older
posts are set up.

`channels` controls where a post appears. Fiction is typically
`[substack]`, which keeps it off the site entirely while still syndicating.

### Covers

```bash
.venv/bin/python scripts/cover_picker.py <slug>
```

Opens a local page: search Unsplash or drop in your own image, drag an
aspect-locked frame to choose the crop, and it writes
`public/covers/<slug>.jpg` at 1456×1048 plus the frontmatter fields above.
Needs `UNSPLASH_ACCESS_KEY` in `.env` for search; the drop-your-own path works
without it.

Covers are stored at Substack's 1456×1048 and cropped to 1200×630 for social
previews. Without one, the OG image falls back to a generated typographic card.

Unsplash requires the photographer credit to be displayed, which is why
`coverCredit` is captured — see the credit line on the post page.

## Publishing

Deploy first — the Substack backlink and the LinkedIn link card both point at
the live post, and a missing cover falls back to the deployed OG image.

1. Run the **Deploy** workflow (or `flyctl deploy`)
2. Check the post looks right at `/blog/<slug>`
3. Run the **Syndicate** workflow with the slug, leaving *dry run* on
4. Re-run with *dry run* off

Substack stops at a **draft** — review and publish from their editor, since
publishing emails the list. LinkedIn has no draft state and posts immediately.

Locally, the guided version walks the whole thing — preflight, cover,
preview, publish:

```bash
python -m venv .venv && .venv/bin/pip install -r scripts/requirements-local.txt
cp .env.example .env    # then fill it in
.venv/bin/python scripts/syndicate.py            # pick from a list
.venv/bin/python scripts/syndicate.py <slug>
.venv/bin/python scripts/syndicate.py <slug> --dry-run
```

Or drive one channel directly:

```bash
.venv/bin/python scripts/syndicate_substack.py <slug> --dry-run
.venv/bin/python scripts/syndicate_linkedin.py <slug> --dry-run
```

### Credentials

Substack has no publishing API — the official one is read-only public profile
data — so `scripts/syndicate_substack.py` drives a signed-in session via
[python-substack](https://github.com/ma2za/python-substack).

Sign in to Substack in your browser, then:

```bash
.venv/bin/pip install -r scripts/requirements-auth.txt   # once
.venv/bin/python scripts/substack_auth.py
```

It reads the session cookie straight out of your browser's cookie store, so
there's nothing to copy by hand. Fallbacks if that doesn't work:

```bash
.venv/bin/python scripts/substack_auth.py --browser firefox
.venv/bin/python scripts/substack_auth.py --paste          # cookie header or devtools JSON
.venv/bin/python scripts/substack_auth.py --from-file cookies.json
```

However it gets the cookie, it authenticates before storing anything, lists the
publication's sections, warns if `tech`/`culture`/`fiction` are missing, and
writes `COOKIES_STRING` to `.env` and the repository secrets. Sessions expire —
re-run this when syndication starts failing to authenticate.

LinkedIn uses the official API. Create an app, add the self-serve *Sign In with
LinkedIn using OpenID Connect* and *Share on LinkedIn* products, and under
**Auth** register this exact redirect URL — it must match to the character, or
authorization fails with "redirect_uri does not match the registered value":

```
http://localhost:8000/callback
```

Put the client id and secret in `.env`, then:

```bash
.venv/bin/python scripts/linkedin_auth.py
```

That opens the consent screen, writes `LINKEDIN_ACCESS_TOKEN` and
`LINKEDIN_AUTHOR_URN` back into `.env`, and offers to push the same values to
the GitHub repository secrets. `--no-env`, `--no-secrets` and `--yes` override
the defaults.

Tokens last ~60 days. LinkedIn only issues refresh tokens to approved Marketing
Developer Platform partners, so on the self-serve path this needs re-running
every couple of months. The **LinkedIn token check** workflow runs weekly and
opens an issue a fortnight before expiry, so it shouldn't catch you out:

```bash
.venv/bin/python scripts/linkedin_token_check.py   # or run the workflow
```

For the workflows, the same values go in GitHub repository secrets:
`PUBLICATION_URL`, `COOKIES_STRING`, `LINKEDIN_ACCESS_TOKEN`,
`LINKEDIN_AUTHOR_URN`, `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, and
`FLY_API_TOKEN` for deploys.

Note that LinkedIn Articles (long-form) can't be created through the API, so
syndication there is a feed post linking back here — which is what you want
anyway, since the traffic lands on your own site.

## Feed

`/feed.xml` — full post content, site channel only.

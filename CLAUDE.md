# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Dev server on localhost:3000
pnpm build      # Production build
pnpm lint       # ESLint
pnpm start      # Start production server
```

No test suite is configured.

## Architecture

Next.js portfolio site using the App Router, TypeScript, and Tailwind CSS. Deployed to Fly.io (Amsterdam region) via Docker.

**Routing:** File-based via `/src/app/`. Pages include home (`/`), `/privacy`, `/terms`, `/detoxer-privacy`, and a `.well-known` API route for Microsoft identity association.

**Components** (`/src/components/`): All UI components. The `splash.tsx` hero uses Three.js with custom GLSL vertex/fragment shaders for an animated wireframe effect. Components needing browser APIs are marked `"use client"`.

**Data:** Projects and work experience are defined as constant arrays directly in `page.tsx` — no database or API.

**Styling:** Tailwind with dark mode via media query (system preference). Custom animated gradient backgrounds in `globals.css`. Glassmorphism pattern: `bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg`.

**Fonts:** Inter and Rubik loaded via `next/font/google`.

**Path alias:** `@/*` maps to `./src/*`.

## Key Config

- `next.config.js` — Webpack loader for `.glsl` shader files; image optimization disabled
- `.editorconfig` — 4-space indent (2-space for YAML/TOML), LF line endings
- `fly.toml` — Fly.io deployment config, internal port 3000

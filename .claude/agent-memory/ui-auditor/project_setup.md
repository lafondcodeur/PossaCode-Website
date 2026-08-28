---
name: project-setup
description: How to run a browser audit against the PossaCode-Website Astro project (server, tooling, Edge path)
metadata:
  type: project
---

**Stack**: Astro (pure, no React/Vue/Svelte), Tailwind v4 via Vite (theme in
`src/styles/global.css` `@theme{}`, no `tailwind.config.js`), colors
`orange-possacode` (#f14d0e) / `blue-possacode` (#1a2251), fonts `font-Phudu`
(headings) / `font-nunito` (body). Layout: `src/layouts/Layout.astro` already
includes `<Header>` + `<Footer>` — pages should not re-import them.

**No MCP browser tool is registered in this environment's toolset** (only
Read/Grep/Glob/Bash/Write/Edit). To do real-browser audit work (axe-core,
screenshots, getBoundingClientRect, contrast), install `playwright-core`
temporarily: `npm install playwright-core --no-save --silent` from the repo
root, uninstall after (`npm uninstall playwright-core --no-save --silent`).
Node must be invoked with `NODE_PATH="$(pwd)/node_modules"` set (or run from
inside the repo dir) or `require('playwright-core')` fails even though it's
installed — the Bash tool's cwd handling for this project doesn't otherwise
resolve it.

**Edge executable path on this machine**:
`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe` — pass as
`executablePath` to `chromium.launch()`.

**Dev server**: usually already running on `http://localhost:4321` (check
before starting a new one — don't kill the user's existing `npm run dev`).
Preview would be 4322 if used.

See [[playwright-screenshot-hangs]] for a real gotcha hit during the
2026-08-27 homepage audit, and [[possacode-recurring-findings]] for defects
that recur across this project's pages.

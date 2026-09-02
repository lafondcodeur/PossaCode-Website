---
name: project-setup
description: How to run a browser audit against the PossaCode-Website Astro project (server, tooling, Edge path)
metadata:
  type: project
---

**Stack**: Astro (pure, no React/Vue/Svelte), Tailwind v4 via Vite (theme in
`src/styles/global.css` `@theme{}`, no `tailwind.config.js`), colors
`orange-possacode` (#f14d0e) / `blue-possacode` (#1a2251) / `orange-possacode-ink`
(#2a0e00, dark text-on-orange-or-light-bg replacement added 2026-08-28), fonts
`font-Phudu` (headings) / `font-nunito` (body). Layout:
`src/layouts/Layout.astro` already includes `<Header>` + `<Footer>` — pages
should not re-import them.

**No MCP browser tool is registered in this environment's toolset** (only
Read/Grep/Glob/Bash/Write/Edit). To do real-browser audit work (axe-core,
screenshots, getBoundingClientRect, contrast), install `playwright-core`
**and** `axe-core` **together in one command** temporarily:
`npm install playwright-core axe-core --no-save --silent` from the repo root.
Installing them in two separate `npm install <pkg> --no-save` calls can prune
the first package (observed 2026-08-30: installing playwright-core, then
axe-core separately, silently removed playwright-core from node_modules even
though the first install reported success) — always install everything
needed for the session in a single `npm install a b --no-save` call. Uninstall
both together after (`npm uninstall playwright-core axe-core --no-save
--silent`).

Scripts requiring `require('playwright-core')` must be run **from inside the
repo root** as a `.cjs` file (this repo's `package.json` has `"type":
"module"`, so a plain `.js` script fails with "require is not defined in ES
module scope"). Setting `NODE_PATH` and running from a scratchpad/temp
directory does NOT reliably resolve `node_modules` on this machine — copy the
script into the repo root (e.g. `audit-tmp.cjs`), run it with plain `node
audit-tmp.cjs`, then delete it before finishing (confirm with `git status`
that no `.cjs`/`.json`/`.png` scratch files or package.json changes remain).

**Astro dev server binds IPv6 loopback only on this machine**: `curl
http://localhost:4321` works (curl resolves `localhost`→`::1` here), but
Playwright/Chromium navigating to `http://localhost:4321` or
`http://127.0.0.1:4321` hangs/`ERR_CONNECTION_REFUSED`. Always navigate
Playwright to `http://[::1]:4321/...` explicitly on this project.

**Edge headless launch flags required on this machine**: `chromium.launch({
executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
headless: true, args: ['--no-sandbox', '--disable-gpu'] })` — without
`--no-sandbox`/`--disable-gpu`, `page.goto()` reliably timed out even though
the browser process launched successfully (observed 2026-08-30). Use forward
slashes in `executablePath` (backslashes survive fine in files written via
the Write tool, but break if the script is ever built through a Bash
heredoc, since the shell interprets them).

**Astro dev toolbar renders in every dev-mode screenshot**: a fixed-position
`<astro-dev-toolbar>` element (small dark pill, usually bottom-center/left)
appears in full-page screenshots taken against the dev server, sometimes
visually overlapping mid-page content because Playwright's full-page capture
freezes `position:fixed` elements at their initial-viewport location while
stretching the rest of the page. Confirmed via
`document.querySelector('astro-dev-toolbar')`. **Not a real site defect** —
absent from `npm run build && npm run preview`. Don't waste time
investigating a floating dark shape in a dev-server screenshot; identify it
via that selector and note it as a tooling artifact instead.

**Dev server**: usually already running on `http://localhost:4321` (check
before starting a new one — don't kill the user's existing `npm run dev`).
Preview would be 4322 if used. If you do start it yourself
(`run_in_background`), a plain `nohup npm run dev &` inside `()` in the Bash
tool did NOT keep it alive (process exited immediately) — just pass
`npm run dev` directly to Bash with `run_in_background: true`, no manual
backgrounding/nohup wrapper needed.

See [[playwright-screenshot-hangs]] for a real gotcha hit during the
2026-08-27 homepage audit, and [[possacode-recurring-findings]] for defects
that recur across this project's pages.

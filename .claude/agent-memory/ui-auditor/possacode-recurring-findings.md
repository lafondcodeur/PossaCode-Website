---
name: possacode-recurring-findings
description: Defect patterns found across PossaCode-Website audits (homepage 2026-08-27, about page 2026-08-30) likely to recur on other routes sharing the same components/tokens
metadata:
  type: project
---

From full audits of `/` (`doc/audit-home-2026-08-27.md`) and `/about`
(`doc/audit-about-2026-08-30.md`). These are **systemic patterns tied to
shared components/tokens**, not one-off bugs — worth re-checking on every
other route since the same files are reused site-wide. Several items below
were fixed between the two audits (see "RESOLVED" markers) — always verify
current state with a grep/measurement before assuming a memory entry still
applies, per the "before recommending from memory" rule.

- **`text-white`/`text-orange-possacode` on an `orange-possacode` background
  measures ~3.6:1**, below the WCAG AA 4.5:1 normal-text threshold, whenever
  the text is under ~18.66px-bold / 24px-normal. A dedicated token
  `--color-orange-possacode-ink` (`#2a0e00`, in `src/styles/global.css`
  `@theme`) was added 2026-08-28 specifically to fix this pattern (works both
  on `bg-orange-possacode` backgrounds AND on light backgrounds where
  `text-orange-possacode` was used directly) — **when you find this pattern,
  the fix is just swapping in this existing token, not inventing a new one**.
  RESOLVED on `index.astro` and `header.astro` (2026-08-28 feature). STILL
  PRESENT as of 2026-08-30 on: `about.astro:75` (hero CTA, known/tracked),
  `about.astro:220+222` (Vision/Mission/Valeurs mosaic "Notre mission" panel,
  newly found), `about.astro:268` (timeline year labels ×4, newly found).
  Check any other page with `.boutton-standard`, `bg-orange-possacode`, or
  `text-orange-possacode` for the same failure before assuming it's fixed.
- **`Layout.astro:29`'s announcement-bar span ("...Dev Girls") measures
  4.17:1** (orange-possacode text on blue-possacode bg) — below 4.5:1, but
  needs the *opposite* fix direction (a lighter orange, not the `-ink`
  token, since the background here is dark not light/orange). Explicitly
  left unresolved in the 2026-08-28 contrast feature and still present
  2026-08-30 — a `--color-orange-possacode-light`-style token doesn't exist
  yet. Site-wide via `Layout.astro`, affects every route.
- **`header.astro`'s "Faire un don" desktop pill (line 20) uses raw hex
  `bg-[#F14D0E]`** instead of the `bg-orange-possacode` token (identical
  color value, just not tokenized) — a design-system consistency violation,
  not a visual bug. Site-wide via `header.astro`. (Note: the same element's
  `href`/keyboard-reachability bug from the first audit, and its text color,
  were both already fixed by 2026-08-30 — only the raw-hex background
  remains.)
- **No skip-to-content link anywhere in `src/`** (verified by grep across
  `src/` in both audits) — same site-wide gap, first Tab always lands on
  the header logo link. Still present 2026-08-30.
- **No explicit `<link rel="canonical">` / Twitter Card / `og:type` /
  `og:url` / favicon `<link>`** in `Layout.astro`'s `<head>` — affects every
  route since they all go through this layout. Still present 2026-08-30
  (confirmed via DOM query on `/about`: canonical=false, twitterTags=0,
  favicon=false; `og:title`/`og:description`/`og:image` are present).
- **Large unoptimized local JPGs used as raw `<img>` (no `astro:assets`, no
  width/height, no lazy loading)** is a page-wide pattern beyond just one
  logo: on `/about` alone, 5 photos (`A3.jpg`, `NOUS.jpg`, `engroupe.jpg`,
  `heri.jpg`, `groupe.jpg`, each 2.4-4.1MB at native resolutions like
  6000x4000) account for 16MB of a 40.4MB total page transfer, displayed at
  a fraction of their native size. Only the Congo DevOps partner logo has
  been migrated to `<Image>` (per project history). Worth checking image
  weight via a network trace (`page.on('response')`, sum `content-length`
  for `resourceType === 'image'`) on any other route with real photos
  (`members.astro`, `index.astro` hero) rather than assuming it's fine.
- **`MemberCarousel.astro` pagination dots** (`w-2.5 h-2.5`, 10x10px) —
  RESOLVED project-wide 2026-08-28 (wrapped in a `min-w-6 min-h-6` button,
  see `context/current-feature.md`). Note: `/about` does NOT use
  `MemberCarousel` at all (only `/` and `/members` do) — don't assume it's
  present on every page with photo bandeaus.
- Two images with suspicious provenance (`maxresdefault - Copie.jpg`,
  `femmecode - Copie.jpg`) were flagged on the homepage (2026-08-27,
  unresolved as of the about-page audit) — worth a repo-wide grep
  (`maxresdefault|Copie`) before any future audit to see if they've spread.
- **Astro dev server binds IPv6 loopback only** and the Astro dev toolbar
  (`<astro-dev-toolbar>`) shows up as a floating fixed-position artifact in
  dev-mode screenshots — see [[project-setup]] for both, these are
  environment/tooling notes not site defects.

See [[project-setup]] for how to re-run this kind of check.

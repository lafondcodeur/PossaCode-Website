---
name: possacode-recurring-findings
description: Defect patterns found on the PossaCode-Website homepage audit (2026-08-27) likely to recur on other pages sharing the same components/tokens
metadata:
  type: project
---

From the first full audit of this project (`doc/audit-home-2026-08-27.md`,
route `/`, dev server). These are **systemic patterns tied to shared
components/tokens**, not one-off bugs — worth re-checking on every other
route since the same files are reused site-wide:

- **White or orange text under ~18.66px on an `orange-possacode` background
  measures ~3.3–3.6:1**, below the WCAG AA 4.5:1 normal-text threshold.
  Confirmed via axe `color-contrast` (impact serious) on 14 nodes: hero CTA
  button, header donate pill, "Participer" button, event date labels, final
  CTA button, Vision/Mission/Valeurs paragraphs. This pattern lives in
  `.boutton-standard` (`src/styles/global.css`) and any inline
  `bg-orange-possacode`/`bg-[#F14D0E]` usage — check any other page using
  these for the same failure before assuming it's fine.
- **`src/components/header.astro`'s "Faire un don" CTA (desktop pill line 20
  + mobile menu line 41) is a plain `<div>`, not a link/button** — no href,
  role, or tabindex, completely unreachable by keyboard/screen reader. Since
  `header.astro` is shared via `Layout.astro` on every page, this is a
  site-wide defect, not homepage-specific.
- **No skip-to-content link anywhere in `src/`** (verified by grep across
  `src/`) — same site-wide gap, first Tab always lands on the header logo
  link.
- **No explicit `<link rel="canonical">` / Twitter Card / `og:type` / `og:url`**
  in `Layout.astro`'s `<head>` — affects every route since they all go
  through this layout.
- **`MemberCarousel.astro` pagination dots are `w-2.5 h-2.5` (10×10px)**,
  below the WCAG 2.2 24×24px target-size minimum (axe `target-size`, 12
  nodes on homepage alone). This component is reused elsewhere (e.g. `about.astro`
  per project history) — check other pages using `<MemberCarousel>` too.
- Raw hex colors (`bg-[#1A2251]`, `text-[#F14D0E]`, `bg-[#fff3ee]`) duplicate
  `orange-possacode`/`blue-possacode` tokens instead of using them — appears
  in `Layout.astro` (the top announcement banner, present on every page) and
  `header.astro`, so also site-wide.
- Two images with suspicious provenance (`maxresdefault - Copie.jpg`,
  `femmecode - Copie.jpg` — filename pattern of a downloaded YouTube
  thumbnail) were already flagged and avoided in `context/current-feature.md`
  for the About page's timeline section, but are still actively used on the
  homepage itself (`src/pages/index.astro` lines 189/207). Worth a repo-wide
  grep (`maxresdefault|Copie`) before any future audit to see if they've
  spread further.

See [[project-setup]] for how to re-run this kind of check.

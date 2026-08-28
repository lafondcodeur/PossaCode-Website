---
name: playwright-screenshot-hangs
description: page.screenshot() hangs indefinitely on this site's pages when the same long-lived context/page is reused across breakpoints, even with animations:'disabled'
metadata:
  type: feedback
---

On PossaCode-Website pages that have infinite CSS animations (`.logo-marquee`,
`.wave-line`, `MemberCarousel` autoplay), calling `page.screenshot()`
repeatedly on the **same** Playwright page/context while looping through
breakpoints (resizing via `setViewportSize`) reliably hung past the
"fonts loaded" log line, even with `{ animations: 'disabled', timeout }` set
— both `fullPage: true` and `fullPage: false` hung. This happened even though
a single one-off screenshot on that page worked fine moments earlier.

**Why (best guess)**: Playwright's animation-freezing step interacts badly
with elements whose animation depends on JS state (carousel autoplay driven
by `scrollLeft`/`setInterval`, not pure CSS), and repeated resizes on the
same page compound this rather than resetting it.

**Fix that worked**: open a **fresh `browser.newContext()` + `newPage()` per
breakpoint** (not a shared page resized in a loop), and pass
`reducedMotion: 'reduce'` to `newContext()` — this site already has
`prefers-reduced-motion` CSS handling for all its animations/marquees/
carousels (a project-wide convention, see `global.css`), so reduced-motion
contexts render statically and `page.screenshot()` returns immediately.

**How to apply**: for any future multi-breakpoint screenshot pass on this
project, always create a new context per width with `reducedMotion: 'reduce'`
rather than resizing one long-lived page. If a single hung script leaves an
orphaned Node process behind, find it via
`wmic process where "name='node.exe'" get ProcessId,CommandLine` (match the
scratchpad script path, NOT the two node processes running `npm run dev` /
`astro dev`) and `taskkill //PID <pid> //F //T`.

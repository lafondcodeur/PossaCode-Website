---
name: project-architecture
description: Architectural conventions and patterns observed in PossaCodeDevHub codebase — server/client split, DB access layer, component structure, auth model (updated 2026-07-28 after a full-codebase audit pass with fixes applied)
metadata:
  type: project
---

PossaCodeDevHub is a mature Next.js 16 / React 19 App Router app. Auth (NextAuth v5, credentials +
GitHub OAuth, email verification, forgot/reset password, rate limiting via Upstash), items CRUD,
collections (read-only sidebar display, no dedicated collections page/CRUD yet), file upload to
Cloudflare R2, code/markdown editors are all built and working. Roadmap items not yet built:
search, collections management page, Stripe billing/Pro gating, AI features, shared collections.

**Why:** Superseded an earlier memory snapshot from 2026-05-15 that described the app as
"no auth implemented yet" — that is no longer true. Always verify against current code, not this
snapshot, since the project moves fast (one feature merged per session per `context/current-feature.md`).

## Key architectural patterns (as of 2026-07-28)

- DB access lives in `src/lib/db/` (`items.ts`, `collections.ts`, `profile.ts`) — pure async
  functions, ownership-scoped via `getUserId()` (react `cache()`-wrapped, reads real session via
  `auth()`, no more hardcoded demo user).
- Mutation query functions (`updateItem`, `deleteItem`, `toggleFavorite/Pin` in `lib/db/items.ts`)
  consistently do `findFirst({ where: { id, userId } })` before mutating — correct IDOR-safe pattern.
  Any new mutation added to this file should follow the same ownership-check-then-mutate shape.
- `src/actions/**` (`"use server"` files) are a thin auth+zod-validation layer that calls into
  `src/lib/db/**` query functions — every action re-checks `auth()` even though the db layer also
  checks; this double-check is intentional defense in depth, not redundant duplication to "clean up".
- All list/stat query functions in `src/lib/db/` (`getCollections`, `getItemTypes`, `getPinnedItems`,
  `getRecentItems`, `getDashboardStats`, plus `getUserId`) are now wrapped in react `cache()` — fixed
  2026-07-28 after finding `getItemTypes`/`getDashboardStats` were genuinely double-queried per
  request (both `(app)/layout.tsx` and `(app)/profile/page.tsx` call them independently within the
  same render). Any new list/stat function added to this layer should follow the same `cache()` pattern.
- No `loading.tsx`, `error.tsx`, or `Suspense` boundaries anywhere in the app (still true as of
  2026-07-28) — `dashboard/page.tsx` renders 4 independent async server components with no
  streaming/fallback UI. Flagged, not fixed (would need design input on fallback UI).
- `CodeEditor`/`MarkdownEditor` are now code-split via `src/components/lazy-editors.tsx`
  (`next/dynamic(..., { ssr: false })`) — the eager-import bundle-bloat issue from the prior audit
  is resolved (see `current-feature.md` history: "Code-Split Heavy Editors").
- Item type→icon resolution logic was duplicated across `item-card.tsx`/`recent-item-row.tsx`;
  deduped 2026-07-28 into `getItemIcon()` in `src/lib/icon-map.ts` (file items → `getFileIcon()`,
  else `iconMap[typeIcon]` falling back to `Code2`). The disabled-looking `MoreHorizontal` kebab
  button (no handler wired anywhere yet, in `ItemCard`, `RecentItemRow`, `ImageCard`,
  `RecentCollections`) is still unwired — likely a deferred feature, not a bug.
- `src/lib/r2.ts`'s `isOwnedR2Key(userId, key)` (checks `${userId}/` prefix) is enforced in
  `createItem` (rejects foreign-namespaced client-supplied `fileUrl`) and `deleteItem` (skips
  deleting a foreign-namespaced `fileUrl`) — the broken-object-reference gap from the prior audit
  is resolved. `DELETE /api/upload` (orphan-cleanup endpoint used by `FileUpload`'s remove button
  and `NewItemDialog`'s cancel path) also enforces `isOwnedR2Key`, and as of 2026-07-28 additionally
  refuses to delete a key that's still referenced by one of the user's `Item` rows (`prisma.item.findFirst`
  check before `deleteFromR2`) — closes a self-inflicted-orphaning gap where a user could otherwise
  call this endpoint directly with an already-attached file's key and break their own item.
- Prisma schema (`prisma/schema.prisma`) has composite indexes on `Item` (userId+isPinned,
  userId+isFavorite, userId+createdAt desc) — no missing-index issues found.
- `checkRateLimit`/Upstash-backed limiters exist for login, register, forgot-password, reset-password,
  change-password, delete-account (`src/lib/rate-limit.ts`). All `createLimiter()` instances share
  the same `prefix: "ratelimit"`, and `@upstash/ratelimit` does NOT disambiguate by Ratelimit
  instance — only by `prefix:identifier`. `login` is keyed `${ip}:${email}` (already unique) and
  `change-password`/`delete-account` were already route-tagged (`change-password:${ip}:${userId}` etc.)
  from a prior fix, but `register`/`forgot-password`/`reset-password` were all keyed by bare
  `getClientIp(request)` with no route tag, meaning they silently shared one Redis bucket per IP
  (hitting register 3x would also exhaust the forgot-password and reset-password quota for that IP).
  Fixed 2026-07-28 by route-tagging all three identifiers (`register:${ip}`, `forgot-password:${ip}`,
  `reset-password:${ip}`), matching the pattern already used by change-password/delete-account.
- `src/lib/mock-data.ts` (348 lines) and the `DEMO_USER_EMAIL` export in `src/lib/db/constants.ts`
  are dead code — confirmed zero imports anywhere in `src/` (only referenced from historical
  `context/features/*.md` spec docs; scripts define their own local demo-email literals). Flagged
  for deletion in the 2026-07-28 audit but not removed — the audit session had no Bash/shell tool
  available, only Read/Write/Edit/Glob/Grep, so file deletion and `npm run build/lint/test`
  verification were not possible that session. Future sessions with Bash access should delete both
  and confirm nothing else picks them up before removing.
- `ItemDrawer` (`src/components/item-drawer.tsx`) is ~630 lines mixing fetch/view/edit-mode state,
  the action bar, and ~8 conditionally-rendered detail sections (description, content, url, image
  preview, file card, tags, collection, timestamps) in one component. Flagged as a decomposition
  candidate (extract an action-bar subcomponent and per-field detail-row subcomponents) but not
  auto-refactored — real behavioral risk in a component with this much conditional/edit-state logic,
  needs the user's sign-off rather than a blind split.
- `item-drawer.tsx`, `image-card.tsx`, and `file-upload.tsx` all use raw `<img>` for R2-served
  previews (via the same-origin `/api/items/[id]/download` proxy) instead of `next/image` — flagged
  as a LOW performance item (no automatic resizing/lazy-loading), not fixed since swapping to
  `next/image` for a dynamically-sized proxy endpoint needs either fixed dimensions or `fill` mode,
  a layout decision better left to the user.

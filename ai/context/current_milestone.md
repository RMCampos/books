# Current Milestone

## Current Focus

**Phase 1 complete — all 7 specs generated.**

Ready to begin implementation. Next step: resolve the open questions below, then start spec 001 (scaffold).

---

## Specs

| # | Name | Status | Convex Feature |
|---|------|--------|----------------|
| 001 | scaffold | **done** | Clerk auth integration |
| 002 | book-entry | ready | query + mutation + live reactivity |
| 003 | book-search | ready | action (external API) |
| 004 | shelves | ready | multi-document atomic mutation |
| 005 | reviews | ready | patch + optional field clearing |
| 006 | cover-images | ready | file storage |
| 007 | stale-reader-reminder | ready | scheduled functions (cron) |

---

## Risks

- TanStack Start + Convex integration: relatively new combination; provider ordering is important (see spec 001 architecture)
- Clerk JWT template setup is a manual step in the dashboard — easy to misconfigure
- Convex mutation time budget: spec 004 `deleteShelf` and spec 007 `markStaleEntries` do full scans — fine at learning scale, documented in each spec

---

## Open Questions

- [x] CSS / component library: **Tailwind + shadcn/ui** — decided
- [x] Book search API: Google Books API — no API key needed for basic search
- [ ] Spec 004 shelf cardinality: **decided — one shelf per entry** (field on `book_entries`)
- [ ] Spec 007 cron job purpose: **decided — stale reading reminder (30 days)**

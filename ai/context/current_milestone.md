# Current Milestone

## Current Focus

**Phase 0 — Greenfield setup and context definition.**

Project is pre-code. Context files have been defined. Next step is scaffolding the project (TanStack Start + Convex init + Clerk setup) before writing any feature specs.

---

## Active Specs

None yet. First spec will cover project scaffolding and the Convex schema.

---

## Risks

- First Convex project — unfamiliarity with Convex-specific patterns (queries, mutations, schema, file storage) may slow early specs
- TanStack Start is relatively new; SSR + Convex integration may have rough edges
- Clerk + Convex integration requires correct JWT template setup in Clerk dashboard

---

## Open Questions

- [ ] CSS / component library choice (Tailwind + shadcn/ui recommended but not decided)
- [ ] Book search API: Google Books API vs. Open Library vs. both
- [ ] Shelf cardinality: can a Book Entry belong to multiple shelves, or exactly one? (current assumption: zero or one)
- [ ] Cover image strategy: always use API URL, or upload to Convex storage? (likely: API URL by default, optional upload later)
- [ ] Cron job purpose: reading reminder? weekly stats? (to be decided when reaching that spec)

# Role: Developer

You implement specs incrementally, clearly, and in a way that stays maintainable.

---

## Before Writing Any Code

Read in this order:
1. `CLAUDE.md` — project rules and entry point
2. The target spec: `ai/specs/NNN-name/spec.md` and `architecture.md`
3. `ai/context/architecture_principles.md` — especially the Convex-specific section
4. `ai/context/domain_glossary.md` — use these exact terms in all identifiers

---

## Convex Implementation Rules

These are non-negotiable:

- **Schema first.** Define or update `convex/schema.ts` before writing any query or mutation. Use `v.id("tableName")` for cross-table references.
- **Auth in every user-scoped function.** Call `ctx.auth.getUserIdentity()` at the top of any query or mutation that touches user data. Throw if identity is null.
- **Queries are reactive.** Frontend list/detail views use `useQuery`. Never `useEffect` + fetch.
- **Mutations are the only write path.** No writes from frontend logic. All writes go through Convex mutation functions.
- **Actions for external I/O only.** Use `action` for the book search API call. Use `query`/`mutation` for everything else.
- **Types from `api`.** Import generated types from `convex/_generated/api` — never write raw string function names.

---

## General Engineering Philosophy

Prefer:
- explicit logic over clever abstractions
- small functions with clear names
- incremental delivery — one acceptance criterion at a time

Avoid:
- untyped `any` — TypeScript strict mode is on
- writing logic in the frontend that belongs in Convex
- adding features not in the current spec

---

## When Done

- Check off every item in the spec's `tasks.md`
- Verify every acceptance criterion in `spec.md`
- Produce a Handoff Contract using `ai/contracts/templates/handoff_contract.md`
- Update `ai/context/current_milestone.md`

# Architecture Principles

## Core Principles

- Keep solutions simple
- Prefer readability over cleverness
- Small incremental delivery
- Avoid overengineering
- Clear boundaries
- Prefer maintainability over perfection
- Favor composability

---

## Delivery Philosophy

Prefer:
- small specs
- iterative delivery
- vertical slices
- simple APIs
- understandable systems

Avoid:
- giant upfront architecture
- premature optimization
- speculative abstractions
- unnecessary microservices

---

## Convex-Specific Principles

Because the primary goal is learning Convex, these rules apply:

- **Use Convex-native patterns first.** Don't reach for external libraries to solve something Convex already handles (e.g. use Convex file storage, not S3; use Convex scheduled functions, not a separate cron service).
- **Keep the schema explicit.** Define all tables and fields in `convex/schema.ts` with proper validators. No schemaless shortcuts.
- **Queries are reactive by default.** Every list or detail view uses `useQuery`. Don't fetch data in `useEffect`.
- **Mutations are the only write path.** All writes go through Convex mutation functions. No direct DB access from the frontend.
- **Actions are for external I/O only.** Use `action` only when calling external APIs (book search). Everything else uses `query` or `mutation`.
- **Auth identity via Clerk.** Always scope data queries to `ctx.auth.getUserIdentity()`. Never trust a `userId` from the client payload.

---

## AI-Native Principles

AI performs significantly better when:
- context is structured
- terminology is consistent
- specs are focused
- workflows are incremental

The repository structure exists to improve AI consistency and collaboration.

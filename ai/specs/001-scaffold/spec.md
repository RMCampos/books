# Spec 001: Project Scaffold

## Goal

A running TanStack Start app connected to Convex with Clerk authentication. A signed-in user sees a placeholder dashboard; a signed-out user is redirected to sign in.

---

## User Value

Without this spec, nothing else can be built. This establishes the full stack: TanStack Start routing, Convex real-time connection, and Clerk identity — all wired together and confirmed working.

---

## Requirements

- TanStack Start project initialized with TypeScript
- Convex initialized (`npx convex dev` runs without errors)
- Clerk application created and connected via the Convex Clerk integration
- Clerk JWT template configured to issue tokens Convex accepts
- Protected route: `/` redirects to Clerk sign-in if not authenticated
- Signed-in user sees their Clerk display name on the dashboard
- Convex `getCurrentUser` query returns the authenticated user's identity

---

## Acceptance Criteria

- [ ] `npx convex dev` starts without errors and deploys schema
- [ ] Visiting `/` while signed out redirects to Clerk's hosted sign-in page
- [ ] After signing in, user sees their name on the dashboard (fetched via Convex query, not directly from Clerk on the client)
- [ ] Convex dashboard shows the `getCurrentUser` query being called with a valid identity
- [ ] Sign-out button returns the user to the sign-in page
- [ ] TypeScript strict mode passes with no errors

---

## Dependencies

None. This is the first spec.

---

## Risks

- Clerk JWT template setup is manual (done in Clerk dashboard); easy to misconfigure
- TanStack Start SSR + Convex client hydration may require specific provider ordering
- Convex Clerk integration requires `CLERK_JWT_ISSUER_DOMAIN` set in Convex environment variables

---

## Notes

The Convex `getCurrentUser` query intentionally fetches identity from `ctx.auth` on the server rather than reading Clerk's client-side state. This validates the Convex ↔ Clerk JWT integration is working and establishes the correct pattern for all future auth-scoped queries.

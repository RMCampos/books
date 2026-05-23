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

- [x] `npx convex dev` starts without errors and deploys schema
- [x] Visiting `/` while signed out redirects to Clerk's hosted sign-in page
- [x] After signing in, user sees their name on the dashboard (fetched via Convex query, not directly from Clerk on the client)
- [x] Convex dashboard shows the `getCurrentUser` query being called with a valid identity
- [x] Sign-out button returns the user to the sign-in page
- [x] TypeScript strict mode passes with no errors

---

## Dependencies

None. This is the first spec.

---

## Implementation Notes

- `@clerk/tanstack-react-start` uses `@clerk/react` (v6) internally — all Clerk imports must use `@clerk/react`, not `@clerk/clerk-react` (v5), to avoid context mismatch
- `ConvexProviderWithClerk` uses SSR guard (`import.meta.env.SSR`) to avoid `useAuth` being called server-side; falls back to plain `ConvexProvider` during SSR
- All Convex + auth hooks live in a `Dashboard` sub-component that only mounts client-side, keeping the SSR shell clean
- `convex/auth.config.ts` sets the Clerk JWT issuer domain for Convex to trust

# Tasks: Spec 001 — Scaffold

## Project Init
- [ ] Create TanStack Start project with TypeScript (`npx create-tsrouter-app` or equivalent)
- [ ] Initialize Convex (`npx convex dev` — creates `convex/` directory and deploys)
- [ ] Install Clerk packages: `@clerk/tanstack-start` (or `@clerk/react`)
- [ ] Install Convex–Clerk bridge: `@convex-dev/auth` or follow Convex Clerk integration docs

## Clerk Setup
- [ ] Create Clerk application in Clerk dashboard
- [ ] Add JWT template named `convex` in Clerk dashboard (Convex > JWT Templates)
- [ ] Copy Clerk publishable key to `.env.local`
- [ ] Set `CLERK_JWT_ISSUER_DOMAIN` in Convex environment variables (via Convex dashboard or `npx convex env set`)

## Convex Schema
- [ ] Create `convex/schema.ts` with empty `defineSchema({})` (establishes codegen)
- [ ] Run `npx convex dev` and confirm no TypeScript errors

## Convex Functions
- [ ] Create `convex/users.ts` with `getCurrentUser` query
- [ ] Verify query returns identity in Convex dashboard > Functions

## Frontend
- [ ] Wrap app root with `ClerkProvider` → `ConvexProviderWithClerk`
- [ ] Create protected `/` route: redirect to `/sign-in` if no Clerk session
- [ ] On `/`: call `useQuery(api.users.getCurrentUser)` and display the user's name
- [ ] Add sign-out button

## Validation
- [ ] Verify all acceptance criteria in `spec.md`
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] Confirm live reactivity: open two browser tabs, sign out in one — both redirect

# Architecture Notes: Spec 001 — Scaffold

## Components

| Component | Responsibility |
|-----------|---------------|
| TanStack Start router | File-based routing, SSR, protected route logic |
| `ConvexProvider` | Wraps the app; provides reactive query/mutation context |
| `ClerkProvider` | Wraps the app; provides Clerk auth context |
| `ConvexProviderWithClerk` | Bridges Clerk auth tokens into Convex — replaces plain `ConvexProvider` |
| `convex/schema.ts` | Schema skeleton (no tables yet; establishes the file and strict TypeScript) |
| `convex/users.ts` | Contains the `getCurrentUser` query |

## Provider Order

```
ClerkProvider
  └── ConvexProviderWithClerk (uses useAuth from Clerk)
        └── App / Router
```

`ConvexProviderWithClerk` must be nested inside `ClerkProvider` so it can access Clerk's `useAuth` hook to attach JWT tokens to Convex requests.

## Convex Functions

| Function | Type | Purpose |
|----------|------|---------|
| `users.getCurrentUser` | `query` | Returns `ctx.auth.getUserIdentity()` — confirms Convex sees the Clerk identity |

```ts
// convex/users.ts
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.auth.getUserIdentity();
  },
});
```

Returns `null` if not authenticated. The frontend redirects on null.

## Routing

```
/ (protected)
  └── requires Clerk session
  └── calls getCurrentUser via useQuery
  └── displays user's name

/sign-in
  └── Clerk hosted or embedded sign-in component
```

## Data Flow (sign-in)

```
User visits / → TanStack Start loader checks Clerk session
→ no session → redirect to /sign-in
→ Clerk sign-in complete → Clerk issues JWT
→ ConvexProviderWithClerk attaches JWT to Convex client
→ useQuery(api.users.getCurrentUser) fires
→ Convex verifies JWT with Clerk JWKS endpoint
→ Returns identity → UI renders user name
```

## Important Decisions

- **`ConvexProviderWithClerk` over plain `ConvexProvider`**: plain provider can't attach Clerk JWTs; using the bridge package (`@convex-dev/auth` or `convex-clerk`) is required
- **No `users` table yet**: Clerk stores all user profile data; Convex only needs the `userId` string (Clerk subject) as a reference field in future tables. A `users` table is not needed unless we store app-specific user preferences.
- **Schema file exists but is empty**: `convex/schema.ts` is created now so TypeScript codegen works correctly from day one

## Risks

- Clerk JWT template must be named exactly as the Convex dashboard expects (`convex` by default)
- `CLERK_JWT_ISSUER_DOMAIN` must be set in Convex environment variables before the integration works
- TanStack Start SSR: if Clerk session is read server-side, the provider setup differs slightly — confirm with TanStack Start + Clerk docs

# Bookshelf

A personal book wishlist app built to learn [Convex](https://convex.dev) deeply.

**Stack**: TanStack Start · Convex · Clerk · Tailwind CSS · shadcn/ui

## Getting started

### Prerequisites

- Node.js 20+
- A [Convex](https://convex.dev) account
- A [Clerk](https://clerk.com) account with a JWT template named `convex`

### Setup

```bash
npm install

# Start the Convex dev server (writes CONVEX_DEPLOYMENT + VITE_CONVEX_URL to .env.local)
npx convex dev

# In a separate terminal, start the frontend
npm run dev
```

Copy `.env.example` to `.env.local` and fill in:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
VITE_CONVEX_URL=https://...convex.cloud
CONVEX_DEPLOYMENT=dev:...
```

## Project structure

```
convex/       Convex backend (schema, queries, mutations, actions, crons)
src/
  routes/     TanStack Start file-based routes
  integrations/
    clerk/    ClerkProvider wrapper
    convex/   ConvexProviderWithClerk wrapper
ai/           Project context, specs, and AI workflow documentation
```

## Implementation plan

See `ai/specs/` for the full spec list. Progress is tracked in `ai/context/current_milestone.md`.

| Spec | Feature | Status |
|------|---------|--------|
| 001 | Scaffold (auth + Convex wired up) | done |
| 002 | Core wishlist (Book Entry CRUD) | pending |
| 003 | Book search via Google Books API | pending |
| 004 | Shelves (custom collections) | pending |
| 005 | Ratings and reviews | pending |
| 006 | Cover image upload (Convex file storage) | pending |
| 007 | Stale reading reminder (Convex cron) | pending |

# Tech Stack

## Frontend

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | TanStack Start | React-based, SSR-capable router + server functions |
| UI library | React 19 | Via TanStack Start |
| Styling | TBD (Tailwind CSS recommended) | Decision not yet made |
| State / data fetching | Convex React hooks | `useQuery`, `useMutation`, `useAction` — no additional data layer |

## Backend

| Layer | Choice | Notes |
|-------|--------|-------|
| Database + backend | Convex (convex.dev) | Reactive DB, serverless functions, file storage, crons |
| Auth | Clerk | `@clerk/clerk-react` + `@clerk/tanstack-start` + Convex Clerk integration |
| Book metadata API | Google Books API (primary) | Free, no API key required for basic search; Open Library as fallback |

## Key Convex Concepts in Use

| Feature | Purpose in this app |
|---------|---------------------|
| `query` functions | Fetch user's wishlist, shelves, book details — all reactive |
| `mutation` functions | Add/remove books, update status, write reviews, manage shelves |
| `action` functions | Call external book search API (Google Books) |
| File storage | Upload and serve book cover images |
| Scheduled functions | Cron job(s) for periodic tasks (e.g. reading reminders) |
| `v.id("tableName")` | Typed document references between tables |

## Development Tooling

| Tool | Purpose |
|------|---------|
| TypeScript | Language throughout |
| Vite | Bundler (via TanStack Start) |
| Convex CLI (`npx convex dev`) | Local dev backend + schema codegen |
| Clerk Dashboard | Auth provider configuration |

## Dependency Decisions (TBD)

- [ ] Tailwind vs. alternative CSS approach
- [ ] Google Books API vs. Open Library (or both)
- [ ] Component library (shadcn/ui, Radix, or none)

# Project Constraints

## Learning Goals (Primary Driver)

This is a learning-first project. Every architectural decision should ask: **"does this teach Convex well?"**

Convex features that MUST be used (not optional):
- **Real-time live queries** — all list views must use `useQuery` with reactive Convex queries
- **Clerk authentication** — user identity via `@clerk/clerk-react` + Convex Clerk integration
- **File storage** — book cover images uploaded and served through Convex file storage
- **Scheduled functions** — at least one cron job (e.g. weekly reading summary, stale "currently reading" reminder)

---

## Technical Constraints

- **Frontend**: TanStack Start (React-based, SSR-capable). No other frontend framework.
- **Backend**: Convex only. No separate REST API, no Express, no database other than Convex.
- **Auth**: Clerk only. No custom auth, no NextAuth, no Supabase Auth.
- **Language**: TypeScript everywhere. Strict mode preferred.
- **Infrastructure cost**: must stay within Convex free tier and Clerk free tier.
- **Book metadata source**: external API (Google Books API or Open Library) for search; manual entry as fallback.

---

## Data / Privacy Constraints

- Each user's wishlist is fully private. No social/sharing features in MVP.
- User identity is managed by Clerk; Convex stores only the Clerk `userId` as the owner reference.
- No PII beyond what Clerk stores. Convex documents hold only app data.

---

## Out of Scope (MVP)

- Social features (following, sharing lists, recommendations)
- Notifications / email delivery
- Mobile app
- Import from Goodreads or other services
- Offline support

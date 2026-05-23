# Project Vision

## Project Name

Bookshelf — Personal Book Wishlist

---

## Problem Statement

Readers accumulate book recommendations from many sources (friends, articles, social media) but have no dedicated place to track them. They forget titles, lose track of what they're currently reading, and have no way to reflect on books they've finished. This app gives each user a personal, live-updating bookshelf to manage their reading life.

---

## Users

- **Authenticated readers** — the only user type. Each user manages their own independent wishlist. No admin role in MVP.

---

## Core Features

- Add and remove books from a personal wishlist
- Search for books via an external API (e.g. Google Books) or enter manually
- Mark reading status: `want_to_read`, `currently_reading`, `read`
- Rate (1–5 stars) and write a short review per book
- Organize books into named custom collections / shelves
- Store and display book cover images (via Convex file storage)
- Real-time UI updates across sessions (Convex live queries)
- User authentication via Clerk

---

## Constraints

- **Learning-first**: this project exists to learn Convex deeply. Prefer Convex-native patterns even if a simpler workaround exists.
- Multi-user: each user's data is private and isolated by identity.
- Free-tier infrastructure only (Convex free plan, Clerk free plan).
- TypeScript throughout — no JavaScript files in `src/` or `convex/`.

---

## Success Criteria

- All four Convex features explored: file storage, scheduled functions, Clerk auth, real-time live queries
- A user can complete the full workflow: sign in → search → add → organize → review → mark read
- Code remains understandable to someone new to Convex
- No over-engineering: app complexity matches a learning project, not a production SaaS

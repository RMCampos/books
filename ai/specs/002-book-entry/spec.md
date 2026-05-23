# Spec 002: Core Wishlist — Book Entry

## Goal

A signed-in user can manually add a book to their wishlist, see all their Book Entries in a live-updating list, change a book's Reading Status, and remove a book.

---

## User Value

This is the core domain feature. Everything else (search, shelves, reviews, cover images) extends a Book Entry. Getting this right — with correct Convex schema, auth scoping, and live reactivity — validates the entire data model.

---

## Requirements

- User can add a book by entering title and author (manual entry; book search comes in spec 003)
- Added book appears in the wishlist instantly (live query — no page refresh)
- User can change a book's Reading Status: `want_to_read` → `currently_reading` → `read`
- Status changes are reflected instantly in the list
- User can remove a Book Entry from their wishlist
- Each user only sees their own Book Entries — another user's data is never returned
- `startedAt` timestamp is recorded when status changes to `currently_reading`
- `finishedAt` timestamp is recorded when status changes to `read`

---

## Acceptance Criteria

- [ ] Adding a book (title + author) creates a `books` document and a `book_entries` document
- [ ] The wishlist query only returns entries where `userId` matches the authenticated Clerk identity
- [ ] Changing status updates the `book_entries` document and the UI updates without a refresh
- [ ] `startedAt` is set when status becomes `currently_reading`; `finishedAt` is set when status becomes `read`
- [ ] Removing a Book Entry deletes only the `book_entries` document (the `books` document is preserved)
- [ ] Opening two browser tabs: adding/removing in one updates the other in real time
- [ ] Calling the wishlist query without authentication returns an empty list or throws — never another user's data

---

## Dependencies

- Spec 001 (scaffold) — Convex + Clerk auth must be working

---

## Risks

- Joining `books` and `book_entries` in a single query requires `ctx.db.get(entry.bookId)` per entry — fine for learning but not optimal at scale (document this pattern explicitly)
- Duplicate books: two users adding "Dune" will create two `books` documents. Deduplication (by ISBN or `googleBooksId`) is out of scope here; spec 003 handles it for API-sourced books

---

## Notes

The `userId` field on `book_entries` stores the Clerk subject string from `ctx.auth.getUserIdentity()?.subject`. This is the canonical pattern for all user-scoped data in this app.

The `books` table stores canonical metadata. Do not store user-specific data (status, rating, review) on `books` — that belongs on `book_entries`.

# Spec 005: Ratings and Reviews

## Goal

A signed-in user can rate a Book Entry (1–5 stars) and write a short review, and can update or clear both at any time.

---

## User Value

After finishing a book, the user wants to record their impression. A rating and review turn the wishlist into a reading journal — making "already read" entries much more valuable to look back on.

---

## Requirements

- User can set a star rating (1–5) on any Book Entry
- User can write a short review (plain text, no formatting) on any Book Entry
- Rating and review are optional — a Book Entry without them is valid
- User can update a rating or review at any time (regardless of Reading Status)
- User can clear a rating or review (set back to empty)
- Rating and review are displayed on the Book Entry card

---

## Acceptance Criteria

- [ ] Setting a rating updates the `book_entries` document and the UI updates reactively (no refresh)
- [ ] Setting a review updates the `book_entries` document and the UI updates reactively
- [ ] Rating is stored as an integer 1–5; the mutation rejects values outside this range
- [ ] Clearing a rating sets `rating` to `undefined` (field absent from document)
- [ ] Clearing a review sets `review` to `undefined`
- [ ] Rating and review are shown on the Book Entry card in the wishlist
- [ ] TypeScript strict mode passes with no errors

---

## Dependencies

- Spec 001 (scaffold)
- Spec 002 (book-entry) — `book_entries` table with `rating` and `review` fields must exist

---

## Risks

- Low risk — this is two `ctx.db.patch` mutations and a small UI addition.

---

## Notes

`rating` and `review` fields were already declared in the `book_entries` schema from spec 002 (as optional fields). No schema change is needed.

The mutation should validate `rating` is between 1 and 5 with a clear error, not silently clamp it. This teaches Convex argument validation best practices.

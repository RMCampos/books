# Spec 004: Shelves

## Goal

A signed-in user can create named Shelves, assign Book Entries to a Shelf, filter their wishlist by Shelf, and delete Shelves they no longer want.

---

## User Value

Shelves let users organize their wishlist by theme, mood, or priority (e.g. "Gift Ideas", "Sci-Fi", "Read Next"). Without shelves, a long wishlist becomes unmanageable.

---

## Requirements

- User can create a Shelf with a name
- User can rename a Shelf
- User can delete a Shelf (Book Entries in that shelf become shelf-less; they are not deleted)
- User can assign a Book Entry to a Shelf
- A Book Entry can belong to at most one Shelf (or none)
- User can remove a Book Entry from its current Shelf (set to no shelf)
- Wishlist page can be filtered to show only entries in a selected Shelf
- Each user only sees their own Shelves

---

## Acceptance Criteria

- [ ] Creating a shelf inserts a `shelves` document and it appears in the shelf list instantly (live query)
- [ ] Renaming a shelf updates the document and all UI showing that shelf name updates reactively
- [ ] Deleting a shelf removes the `shelves` document and clears `shelfId` on all affected `book_entries`
- [ ] Assigning a Book Entry to a shelf sets `shelfId` on the entry and the entry appears under that shelf in filtered view
- [ ] A Book Entry's shelf can be changed or cleared; previous shelf is not affected
- [ ] Filtering the wishlist by shelf shows only entries with the matching `shelfId`
- [ ] Shelf list query only returns the current user's shelves
- [ ] TypeScript strict mode passes with no errors

---

## Dependencies

- Spec 001 (scaffold)
- Spec 002 (book-entry) — `book_entries` table and `shelfId` field must exist

---

## Risks

- Deleting a shelf requires updating all affected `book_entries` in the same mutation — this is a multi-document write, which Convex handles atomically. Verify this works correctly.
- If the user has many Book Entries on a shelf, the delete mutation may need to paginate or batch the `shelfId` clear — Convex mutations have a 1-second time budget. For this learning project, a simple `collect()` + loop is fine; add a comment noting the limitation.

---

## Notes

The `shelfId` field was included in the `book_entries` schema from spec 002 (as `v.optional(v.id("shelves"))`). No schema migration is needed — the field already exists, just unused until this spec.

# Spec 003: Book Search via Google Books API

## Goal

A signed-in user can search for books by title or author using the Google Books API and add a result directly to their wishlist — without having to type metadata manually.

---

## User Value

Manual entry (spec 002) is tedious. Search makes the app actually pleasant to use. This spec also introduces the Convex `action` function type, which is the correct way to call external APIs from Convex.

---

## Requirements

- Search input accepts a title or author query
- Results are fetched from the Google Books API via a Convex `action`
- Each result shows: title, author(s), cover image thumbnail, and description (truncated)
- User can add any result to their wishlist with one click
- Adding from search results reuses the `addBook` mutation from spec 002, enriched with API metadata (`googleBooksId`, `coverUrl`, `isbn`)
- If the same book (by `googleBooksId`) already exists in `books`, the existing record is reused — no duplicate created
- If the book is already in the user's wishlist, the add button is disabled with a "Already in wishlist" label
- Search results are not persisted in Convex — they are ephemeral (returned directly from the action)

---

## Acceptance Criteria

- [ ] Typing a query and submitting calls `searchBooks` action and displays results
- [ ] Results show title, author, cover thumbnail, and short description
- [ ] Clicking "Add to wishlist" calls `addBook` mutation and the book appears in the user's wishlist
- [ ] The `books` document created from a search result has `googleBooksId` and `coverUrl` populated
- [ ] Adding the same Google Books result twice does not create a duplicate `books` document (deduplication by `googleBooksId`)
- [ ] A book already in the user's wishlist shows "Already in wishlist" (disabled) instead of "Add"
- [ ] Empty search string shows no results (no API call made)
- [ ] TypeScript strict mode passes with no errors

---

## Dependencies

- Spec 001 (scaffold)
- Spec 002 (book-entry) — `addBook` mutation must exist

---

## Risks

- Google Books API rate limits: unauthenticated requests are limited to ~1000/day per IP; not a concern for dev/learning but worth noting
- Google Books API response shape can vary (missing authors, missing thumbnail) — handle gracefully with optional fields
- The action ↔ mutation pattern (action calls external API, then mutation writes to DB) is a key Convex concept; document it clearly in the code

---

## Notes

A Convex `action` can call external APIs but **cannot write to the database directly**. The correct pattern is: action fetches data → returns results to the client → client calls a mutation to persist the chosen result. This spec demonstrates that pattern.

The Google Books API base URL: `https://www.googleapis.com/books/v1/volumes?q=<query>`. No API key required for basic search volume.

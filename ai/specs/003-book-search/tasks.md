# Tasks: Spec 003 — Book Search

## Schema
- [ ] No schema changes needed — existing `books` and `book_entries` tables are sufficient
- [ ] Confirm `books` table already has `googleBooksId`, `coverUrl`, `isbn` fields (added in spec 002 schema)

## Convex Functions
- [ ] Create `convex/books.ts` with `searchBooks` action
- [ ] Implement Google Books API fetch with graceful fallbacks for missing fields
- [ ] Fix HTTP→HTTPS for cover thumbnail URLs
- [ ] Update `addBook` mutation in `convex/bookEntries.ts` to accept `googleBooksId`, `coverUrl`, `isbn`
- [ ] Add deduplication logic in `addBook`: check for existing `books` doc by `googleBooksId` before creating

## Frontend
- [ ] Create `BookSearchPage` or search panel on `WishlistPage`
- [ ] Implement search input with debounce or submit-on-enter
- [ ] Call `useAction(api.books.searchBooks)` and handle loading/error states
- [ ] Render `BookSearchResult` list with cover image, title, author, description snippet
- [ ] Add "Add to wishlist" button per result
- [ ] Detect already-in-wishlist by comparing `googleBooksId` against loaded wishlist
- [ ] Disable and label button as "Already in wishlist" when applicable

## Validation
- [ ] Verify all acceptance criteria in `spec.md`
- [ ] Search for a book → add it → confirm `books` doc has `googleBooksId` and `coverUrl` in Convex dashboard
- [ ] Search same book again → "Already in wishlist" appears
- [ ] Add same Google Books result from two different searches → only one `books` document created
- [ ] `npx tsc --noEmit` passes with zero errors

# Architecture Notes: Spec 003 — Book Search

## No Schema Changes

Search results are ephemeral — not stored in Convex. The existing `books` and `book_entries` tables from spec 002 are sufficient. The `addBook` mutation gains new optional arguments.

## Convex Functions

| Function | Type | File | Purpose |
|----------|------|------|---------|
| `books.searchBooks` | `action` | `convex/books.ts` | Calls Google Books API, returns array of candidates |
| `bookEntries.addBook` | `mutation` | `convex/bookEntries.ts` | Extended to accept `googleBooksId`, `coverUrl`, `isbn` (all optional) |

### Why `action` and not `mutation`?

Convex `mutation` functions run inside a transaction and **cannot make network requests**. External HTTP calls require an `action`. Actions run outside the transaction layer — they can call fetch, then call a mutation to write results.

### `searchBooks` action pattern

```ts
export const searchBooks = action({
  args: { query: v.string() },
  handler: async (_ctx, { query }) => {
    if (!query.trim()) return [];
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10`
    );
    const data = await res.json();
    return (data.items ?? []).map((item: any) => ({
      googleBooksId: item.id,
      title: item.volumeInfo.title ?? "Unknown title",
      author: (item.volumeInfo.authors ?? ["Unknown author"]).join(", "),
      description: item.volumeInfo.description ?? null,
      coverUrl: item.volumeInfo.imageLinks?.thumbnail ?? null,
      isbn: item.volumeInfo.industryIdentifiers?.find(
        (id: any) => id.type === "ISBN_13"
      )?.identifier ?? null,
    }));
  },
});
```

Note: `_ctx` — the action context is available but unused here since we're not writing to the DB. Auth is not required for a read-only search; the mutation that saves the book enforces auth.

### `addBook` mutation update

Add optional args: `googleBooksId`, `coverUrl`, `isbn`. Before creating a new `books` document, check if one with the same `googleBooksId` already exists:

```ts
if (args.googleBooksId) {
  const existing = await ctx.db
    .query("books")
    .filter((q) => q.eq(q.field("googleBooksId"), args.googleBooksId))
    .first();
  if (existing) bookId = existing._id;  // reuse existing book doc
}
```

## Data Flow (search and add)

```
User types query → submit
→ useAction(api.books.searchBooks) fires
→ Convex action calls Google Books API
→ Returns array of book candidates to client
→ UI renders results list

User clicks "Add to wishlist"
→ useMutation(api.bookEntries.addBook) fires with full metadata
→ Mutation: find or create books doc (by googleBooksId) → create book_entries doc
→ getMyWishlist reactive query fires automatically
→ UI wishlist updates
```

## "Already in wishlist" Detection

The search results component receives the current wishlist (from `useQuery(api.bookEntries.getMyWishlist)`). For each search result, check if a `book_entries` doc exists whose `books.googleBooksId` matches the result's `googleBooksId`. If yes, disable the add button.

This check happens client-side against the already-loaded wishlist — no extra Convex query needed.

## Frontend Components

- `BookSearchPage` (or modal/drawer on `WishlistPage`) — search input + results list
- `BookSearchResult` — single result card: cover, title, author, description snippet, add button
- Re-uses `useMutation(api.bookEntries.addBook)` from spec 002

## Important Decisions

- **Action returns data, mutation writes data**: the action is stateless and returns results to the client; the client decides which result to add and calls the mutation. This is the correct Convex pattern.
- **No caching of search results in Convex**: ephemeral results keep the schema simple. Caching would require a `search_results` table with TTL cleanup — unnecessary complexity.
- **Deduplication by `googleBooksId`**: prevents duplicate `books` documents for API-sourced books. Manual entries (no `googleBooksId`) are never deduplicated — acceptable tradeoff.

## Risks

- Google Books API `imageLinks.thumbnail` URLs use HTTP not HTTPS — some browsers block mixed content. Use `replace("http://", "https://")` on the URL.
- API can return malformed or missing fields — the mapping function must default gracefully.

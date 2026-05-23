# Architecture Notes: Spec 002 — Core Wishlist

## Convex Schema

```ts
// convex/schema.ts
books: defineTable({
  title: v.string(),
  author: v.string(),
  description: v.optional(v.string()),
  isbn: v.optional(v.string()),
  googleBooksId: v.optional(v.string()),   // populated in spec 003
  coverUrl: v.optional(v.string()),         // populated in spec 003
}),

book_entries: defineTable({
  userId: v.string(),                        // Clerk subject
  bookId: v.id("books"),
  status: v.union(
    v.literal("want_to_read"),
    v.literal("currently_reading"),
    v.literal("read")
  ),
  shelfId: v.optional(v.id("shelves")),     // populated in spec 004
  addedAt: v.number(),
  startedAt: v.optional(v.number()),
  finishedAt: v.optional(v.number()),
  rating: v.optional(v.number()),           // populated in spec 005
  review: v.optional(v.string()),           // populated in spec 005
  isStale: v.optional(v.boolean()),         // populated in spec 007
  coverStorageId: v.optional(v.id("_storage")), // populated in spec 006
}).index("by_user", ["userId"]),
```

The `by_user` index makes `getMyWishlist` efficient: it queries only the current user's entries without a full table scan.

## Convex Functions

| Function | Type | File | Purpose |
|----------|------|------|---------|
| `bookEntries.getMyWishlist` | `query` | `convex/bookEntries.ts` | Returns all entries + book data for the authenticated user |
| `bookEntries.addBook` | `mutation` | `convex/bookEntries.ts` | Creates a `books` doc + a `book_entries` doc |
| `bookEntries.removeBook` | `mutation` | `convex/bookEntries.ts` | Deletes a `book_entries` doc |
| `bookEntries.updateStatus` | `mutation` | `convex/bookEntries.ts` | Updates status, sets startedAt/finishedAt |

### `getMyWishlist` pattern

```ts
const identity = await ctx.auth.getUserIdentity();
if (!identity) return [];
const entries = await ctx.db
  .query("book_entries")
  .withIndex("by_user", (q) => q.eq("userId", identity.subject))
  .collect();
return Promise.all(
  entries.map(async (entry) => ({
    ...entry,
    book: await ctx.db.get(entry.bookId),
  }))
);
```

This is the standard Convex pattern for "join" — fetch related documents individually inside the handler. It's explicit and type-safe.

### Auth guard pattern (used in every mutation)

```ts
const identity = await ctx.auth.getUserIdentity();
if (!identity) throw new Error("Unauthenticated");
```

Always throw on missing identity in mutations — never silently skip the write.

## Data Flow (add book)

```
User submits title + author
→ useMutation(api.bookEntries.addBook)
→ Convex mutation: create books doc → create book_entries doc with userId
→ getMyWishlist query auto-fires (reactive)
→ UI re-renders with new entry — no refresh
```

## Components (Frontend)

- `WishlistPage` — calls `useQuery(api.bookEntries.getMyWishlist)`, renders list
- `AddBookForm` — controlled form, calls `useMutation(api.bookEntries.addBook)` on submit
- `BookEntryCard` — displays book title, author, status; has status dropdown and remove button

## Important Decisions

- **`books` and `book_entries` are separate tables**: matches the domain glossary and teaches cross-table references with `v.id()`. Embedding book data in entries would be simpler but wouldn't demonstrate the pattern.
- **No deduplication of `books`**: two users adding "Dune" creates two records. This is acceptable for spec 002 scope; spec 003 will use `googleBooksId` to deduplicate API-sourced books.
- **`userId` is a string, not a Convex document reference**: Clerk subjects are strings; there's no `users` table. This keeps the schema simple — no need to create a Convex user record on sign-up.
- **`removeBook` deletes only the entry, not the book**: preserves the canonical `books` record for potential future use by other users.

## Risks

- `ctx.db.get()` per entry in `getMyWishlist` is N+1. Fine for this project's scale; add a code comment noting this pattern and when you'd switch to a denormalized approach.

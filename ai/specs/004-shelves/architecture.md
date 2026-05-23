# Architecture Notes: Spec 004 — Shelves

## Schema Addition

```ts
// convex/schema.ts — add:
shelves: defineTable({
  userId: v.string(),       // Clerk subject
  name: v.string(),
  createdAt: v.number(),
}).index("by_user", ["userId"]),
```

`book_entries.shelfId` was already declared as `v.optional(v.id("shelves"))` in spec 002 — no change needed there.

## Convex Functions

| Function | Type | File | Purpose |
|----------|------|------|---------|
| `shelves.getMyShelves` | `query` | `convex/shelves.ts` | Returns all shelves for the current user |
| `shelves.createShelf` | `mutation` | `convex/shelves.ts` | Creates a new shelf |
| `shelves.renameShelf` | `mutation` | `convex/shelves.ts` | Updates a shelf's name |
| `shelves.deleteShelf` | `mutation` | `convex/shelves.ts` | Deletes shelf + clears shelfId on all its entries |
| `bookEntries.assignToShelf` | `mutation` | `convex/bookEntries.ts` | Sets shelfId on a Book Entry (or clears it) |

### `deleteShelf` — multi-document atomic write

```ts
// 1. Verify ownership
const shelf = await ctx.db.get(args.shelfId);
if (!shelf || shelf.userId !== identity.subject) throw new Error("Not found");

// 2. Clear shelfId on all entries in this shelf
const entries = await ctx.db
  .query("book_entries")
  .withIndex("by_user", (q) => q.eq("userId", identity.subject))
  .filter((q) => q.eq(q.field("shelfId"), args.shelfId))
  .collect();
await Promise.all(entries.map((e) => ctx.db.patch(e._id, { shelfId: undefined })));

// 3. Delete the shelf
await ctx.db.delete(args.shelfId);
```

All three steps execute in a single Convex mutation — they are atomic. If any step fails, none of the writes are committed.

### Ownership check pattern

Every mutation that operates on a shelf or book entry must verify the document's `userId` matches `identity.subject`. Never trust the client to pass correct IDs:

```ts
const shelf = await ctx.db.get(args.shelfId);
if (!shelf || shelf.userId !== identity.subject) throw new Error("Unauthorized");
```

## Data Flow (create shelf + assign)

```
User types shelf name → submit
→ useMutation(api.shelves.createShelf)
→ Inserts shelves doc
→ getMyShelves query fires reactively → shelf appears in list

User selects shelf from Book Entry dropdown
→ useMutation(api.bookEntries.assignToShelf) with { entryId, shelfId }
→ Patches book_entries doc
→ getMyWishlist fires reactively → entry shows new shelf label
```

## Frontend Components

- `ShelfList` — sidebar or top filter bar; calls `useQuery(api.shelves.getMyShelves)`; clicking a shelf filters the wishlist
- `CreateShelfForm` — inline input for new shelf name
- `ShelfBadge` (on `BookEntryCard`) — shows current shelf; has a dropdown to assign/clear
- `WishlistPage` — accepts `selectedShelfId` state; passes to `getMyWishlist` or filters client-side

### Filtering approach

Two options:
1. **Server-side**: add `shelfId` arg to `getMyWishlist` query, apply filter in Convex
2. **Client-side**: load all entries, filter in the component

For this learning project, **client-side filtering** is simpler and demonstrates that Convex reactive queries already have the data available. Add a comment that server-side filtering via query args is preferable at scale.

## Important Decisions

- **One shelf per entry**: `shelfId` is a single optional field on `book_entries`. No junction table. Simpler schema, easier to reason about.
- **Deleting a shelf clears entries, doesn't delete them**: preserves the user's Book Entries. A user who deletes "Sci-Fi" shelf doesn't lose those books.
- **`createdAt` on shelves**: enables future sorting by creation order.

## Risks

- Convex mutation time budget (~1s): if a user has hundreds of entries on one shelf, the `collect()` + batch patch in `deleteShelf` could time out. For this project's scale it's fine — add a code comment noting this.

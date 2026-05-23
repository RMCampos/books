# Architecture Notes: Spec 006 — Cover Image Upload

## No Schema Changes

`coverStorageId: v.optional(v.id("_storage"))` was declared in `book_entries` in spec 002. No migration needed.

## Convex Functions

| Function | Type | File | Purpose |
|----------|------|------|---------|
| `bookEntries.generateUploadUrl` | `mutation` | `convex/bookEntries.ts` | Returns a one-time Convex storage upload URL |
| `bookEntries.setCoverImage` | `mutation` | `convex/bookEntries.ts` | Stores storage ID on entry; deletes old storage object if exists |
| `bookEntries.removeCoverImage` | `mutation` | `convex/bookEntries.ts` | Clears coverStorageId; deletes storage object |
| `bookEntries.getCoverUrl` | `query` | `convex/bookEntries.ts` | Returns the public URL for a storage ID |

### Why `generateUploadUrl` is a mutation

`ctx.storage.generateUploadUrl()` must be called in a `mutation` (or `action`), not a `query`. Queries are read-only. Use a mutation that just calls `generateUploadUrl` and returns the URL — no document write needed.

```ts
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    return await ctx.storage.generateUploadUrl();
  },
});
```

### `setCoverImage` mutation

```ts
export const setCoverImage = mutation({
  args: {
    entryId: v.id("book_entries"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, { entryId, storageId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const entry = await ctx.db.get(entryId);
    if (!entry || entry.userId !== identity.subject) throw new Error("Not found");

    // Delete old storage object to avoid orphans
    if (entry.coverStorageId) {
      await ctx.storage.delete(entry.coverStorageId);
    }

    await ctx.db.patch(entryId, { coverStorageId: storageId });
  },
});
```

### `getCoverUrl` query

```ts
export const getCoverUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});
```

The returned URL is a signed, time-limited CDN URL. Call this query whenever you need to display a stored cover.

## Upload Flow (Frontend)

```
User selects image file
→ useMutation(api.bookEntries.generateUploadUrl) → uploadUrl
→ fetch(uploadUrl, { method: "PUT", body: file }) → response
→ storageId = (await response.json()).storageId
→ useMutation(api.bookEntries.setCoverImage)({ entryId, storageId })
→ getMyWishlist reactive query fires → cover updates
```

## Cover Display Priority

```
coverStorageId exists?
  YES → useQuery(api.bookEntries.getCoverUrl, { storageId }) → <img src={url} />
  NO  → books.coverUrl exists? → <img src={coverUrl} />
  NO  → <PlaceholderCover />
```

This logic lives in the `BookEntryCard` component.

## Frontend Components

- `CoverUploadButton` — file input, handles the 3-step upload flow, shows progress
- `CoverImage` — displays cover with the priority fallback logic above
- Both integrated into `BookEntryCard`

## Important Decisions

- **Delete old storage object on replace**: avoids orphaned files accumulating in storage. Always delete the old `storageId` before storing the new one.
- **`getCoverUrl` as a query (not inline URL construction)**: storage URLs are not directly constructible from the storage ID on the client. They must be fetched via `ctx.storage.getUrl()` inside a Convex function.
- **Auth guard on `generateUploadUrl`**: prevents unauthenticated file uploads even though the upload URL itself is public (anyone with the URL can upload during its short validity window).

## Risks

- `ctx.storage.getUrl()` returns `null` if the storage object was deleted. Handle this case in the display component.
- Upload URL has a short TTL (~1 minute). If the user waits too long between generating the URL and uploading, the upload will fail. This is acceptable for a learning project.

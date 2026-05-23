# Architecture Notes: Spec 005 — Ratings and Reviews

## No Schema Changes

`rating: v.optional(v.number())` and `review: v.optional(v.string())` were declared in `book_entries` in spec 002. No migration needed.

## Convex Functions

| Function | Type | File | Purpose |
|----------|------|------|---------|
| `bookEntries.setRating` | `mutation` | `convex/bookEntries.ts` | Sets or clears the rating on a Book Entry |
| `bookEntries.setReview` | `mutation` | `convex/bookEntries.ts` | Sets or clears the review text on a Book Entry |

These can be combined into a single `updateBookEntry` mutation if desired, but keeping them separate is more explicit and easier to test.

### `setRating` pattern

```ts
export const setRating = mutation({
  args: {
    entryId: v.id("book_entries"),
    rating: v.optional(v.number()),  // undefined = clear
  },
  handler: async (ctx, { entryId, rating }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const entry = await ctx.db.get(entryId);
    if (!entry || entry.userId !== identity.subject) throw new Error("Not found");

    if (rating !== undefined && (rating < 1 || rating > 5 || !Number.isInteger(rating))) {
      throw new Error("Rating must be an integer between 1 and 5");
    }

    await ctx.db.patch(entryId, { rating });
  },
});
```

Passing `rating: undefined` clears the field (Convex removes optional fields set to `undefined`).

### `setReview` pattern

Same shape as `setRating`: auth guard → ownership check → `ctx.db.patch(entryId, { review })`. Passing `review: undefined` clears the field.

## Frontend Components

- `RatingWidget` — 5-star interactive input (click to set, click same star to clear); calls `useMutation(api.bookEntries.setRating)`
- `ReviewInput` — textarea with a save button; calls `useMutation(api.bookEntries.setReview)` on blur or explicit save
- Both components added to `BookEntryCard` or a book detail drawer/modal

## Important Decisions

- **Server-side validation of rating range**: don't rely on the UI to clamp values. The mutation throws if the value is invalid. This is the correct Convex pattern — treat client input as untrusted at the mutation boundary.
- **`undefined` to clear**: Convex `patch` with `{ field: undefined }` removes the field from the document. This is intentional and clean — no need for a separate "clear rating" mutation.
- **No restriction on Reading Status**: a user can rate any entry regardless of status. Restricting to `read`-only would require UI enforcement but offers no real safety benefit.

## Risks

- None significant. This is the lowest-risk spec in the set.

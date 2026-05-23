# Tasks: Spec 002 — Core Wishlist

## Schema
- [ ] Add `books` table to `convex/schema.ts` with all fields from architecture.md
- [ ] Add `book_entries` table with `by_user` index
- [ ] Run `npx convex dev` and confirm codegen succeeds (no TypeScript errors)

## Convex Functions
- [ ] Create `convex/bookEntries.ts`
- [ ] Implement `getMyWishlist` query with auth guard and `by_user` index usage
- [ ] Implement `addBook` mutation: auth guard → create books doc → create book_entries doc
- [ ] Implement `removeBook` mutation: auth guard → ownership check → delete entry only
- [ ] Implement `updateStatus` mutation: auth guard → ownership check → update status + set startedAt/finishedAt

## Frontend
- [ ] Create `WishlistPage` that calls `useQuery(api.bookEntries.getMyWishlist)`
- [ ] Create `AddBookForm` with title + author fields, calls `useMutation(api.bookEntries.addBook)`
- [ ] Create `BookEntryCard` with status selector and remove button
- [ ] Wire remove button to `useMutation(api.bookEntries.removeBook)`
- [ ] Wire status selector to `useMutation(api.bookEntries.updateStatus)`
- [ ] Handle loading state (`getMyWishlist` returns `undefined` before first result)

## Validation
- [ ] Verify all acceptance criteria in `spec.md`
- [ ] Confirm live reactivity: open two tabs — add in one, see it appear in the other
- [ ] Confirm auth isolation: two different Clerk accounts see only their own entries
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] Check Convex dashboard to confirm `book_entries` documents have correct `userId` field

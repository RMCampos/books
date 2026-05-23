# Tasks: Spec 004 — Shelves

## Schema
- [ ] Add `shelves` table to `convex/schema.ts` with `by_user` index
- [ ] Confirm `book_entries` already has `shelfId: v.optional(v.id("shelves"))` (from spec 002)
- [ ] Run `npx convex dev` and confirm codegen succeeds

## Convex Functions
- [ ] Create `convex/shelves.ts`
- [ ] Implement `getMyShelves` query with auth guard and `by_user` index
- [ ] Implement `createShelf` mutation with auth guard
- [ ] Implement `renameShelf` mutation with auth guard + ownership check
- [ ] Implement `deleteShelf` mutation: ownership check → clear shelfId on entries → delete shelf (atomic)
- [ ] Implement `assignToShelf` mutation in `convex/bookEntries.ts`: auth + ownership check → patch `shelfId`

## Frontend
- [ ] Create `ShelfList` component calling `useQuery(api.shelves.getMyShelves)`
- [ ] Create `CreateShelfForm` calling `useMutation(api.shelves.createShelf)`
- [ ] Add rename and delete actions to shelf items
- [ ] Add shelf assignment dropdown to `BookEntryCard`
- [ ] Implement shelf filter on `WishlistPage` (client-side filtering)

## Validation
- [ ] Verify all acceptance criteria in `spec.md`
- [ ] Create shelf → appears instantly (live query)
- [ ] Delete shelf with assigned entries → entries remain, shelf label removed
- [ ] Assign entry to shelf → filter by that shelf → entry appears
- [ ] Confirm two users cannot see each other's shelves
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] Confirm live reactivity: rename shelf in one tab → name updates in other tab

# Tasks: Spec 005 — Ratings and Reviews

## Schema
- [ ] Confirm `book_entries` has `rating: v.optional(v.number())` and `review: v.optional(v.string())` (from spec 002)
- [ ] No schema changes needed

## Convex Functions
- [ ] Add `setRating` mutation to `convex/bookEntries.ts` with auth guard, ownership check, range validation
- [ ] Add `setReview` mutation to `convex/bookEntries.ts` with auth guard, ownership check
- [ ] Confirm that passing `rating: undefined` clears the field in Convex dashboard after testing

## Frontend
- [ ] Create `RatingWidget` (5 clickable stars; clicking the active star clears the rating)
- [ ] Create `ReviewInput` (textarea + save/clear buttons)
- [ ] Add both to `BookEntryCard` or book detail view
- [ ] Wire `RatingWidget` to `useMutation(api.bookEntries.setRating)`
- [ ] Wire `ReviewInput` to `useMutation(api.bookEntries.setReview)`
- [ ] Display current rating and review on the card

## Validation
- [ ] Verify all acceptance criteria in `spec.md`
- [ ] Set rating → confirm value in Convex dashboard
- [ ] Submit rating of 0 or 6 → mutation throws error
- [ ] Clear rating → field absent from Convex document (not `null`, not `0`)
- [ ] Set review → update it → clear it → confirm each state in dashboard
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] Confirm live reactivity: set rating in one tab → updates in other tab

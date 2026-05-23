# Tasks: Spec 007 — Stale Reader Reminder

## Schema
- [ ] Confirm `book_entries` has `isStale: v.optional(v.boolean())` and `startedAt: v.optional(v.number())` (from spec 002)
- [ ] No schema changes needed

## Convex Functions
- [ ] Add `markStaleEntries` mutation to `convex/bookEntries.ts` (no auth guard — scheduler context)
- [ ] Define `STALE_THRESHOLD_MS` constant at top of file
- [ ] Update `updateStatus` mutation to clear `isStale` when status changes away from `currently_reading`
- [ ] Create `convex/crons.ts` with daily cron registration pointing to `api.bookEntries.markStaleEntries`

## Frontend
- [ ] Add stale indicator to `BookEntryCard` when `isStale === true && status === "currently_reading"`
- [ ] Display "Still reading? It's been 30+ days." badge or similar message

## Validation
- [ ] Verify all acceptance criteria in `spec.md`
- [ ] Deploy `convex/crons.ts` — confirm cron appears in Convex dashboard > Scheduled Functions
- [ ] Manually set a `book_entry` with `status: "currently_reading"` and `startedAt: Date.now() - 31 days` in Convex dashboard
- [ ] Trigger `markStaleEntries` via Convex dashboard "Run now" → confirm `isStale: true` is set
- [ ] Change entry status via UI → confirm `isStale` is cleared
- [ ] `npx tsc --noEmit` passes with zero errors

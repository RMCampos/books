# Spec 007: Stale Reader Reminder (Convex Scheduled Functions)

## Goal

A Convex cron job runs daily and marks any Book Entry with status `currently_reading` whose `startedAt` is more than 30 days ago as stale. The wishlist UI highlights stale entries so the user is nudged to update their status.

---

## User Value

It's easy to forget a book you started reading. A visual "stale" indicator on entries that have been `currently_reading` for over a month gives the user a gentle nudge to either continue, mark it as read, or move it back to `want_to_read`.

---

## Requirements

- A Convex scheduled function (cron) runs once per day
- The cron calls a mutation that sets `isStale: true` on any `book_entries` document where:
  - `status === "currently_reading"`
  - `startedAt` is more than 30 days before the current time
- When a user changes the status of a stale entry (to `read` or `want_to_read`), `isStale` is cleared back to `false` / `undefined`
- Stale Book Entries are visually highlighted in the wishlist (e.g. a warning badge or muted style)
- The cron runs for all users, not just the current user

---

## Acceptance Criteria

- [ ] `convex/crons.ts` exists and registers a daily cron that calls `bookEntries.markStaleEntries`
- [ ] `markStaleEntries` mutation sets `isStale: true` on qualifying entries (currently_reading + startedAt > 30 days ago)
- [ ] `markStaleEntries` also clears `isStale` (sets to `undefined`) on entries that no longer qualify (e.g. status was changed manually)
- [ ] Changing a stale entry's status via `updateStatus` clears `isStale`
- [ ] Stale entries show a visual indicator in the UI
- [ ] The cron job is visible in the Convex dashboard > Scheduled Functions
- [ ] TypeScript strict mode passes with no errors

---

## Dependencies

- Spec 001 (scaffold)
- Spec 002 (book-entry) — `book_entries` table with `isStale`, `status`, and `startedAt` fields must exist

---

## Risks

- Cron mutations scan all `book_entries` documents across all users — no `userId` filter. For this project's scale this is fine; at production scale you'd use indexes and pagination. Add a comment.
- The 30-day threshold is hardcoded. Consider making it a constant at the top of the file.
- Convex crons cannot be tested via the standard test flow — use the Convex dashboard's "Run now" button to trigger the cron manually during development.

---

## Notes

Convex scheduled functions are defined in `convex/crons.ts` using the `cronJobs` API:

```ts
import { cronJobs } from "convex/server";
const crons = cronJobs();
crons.daily("mark stale reading entries", { hourUTC: 6, minuteUTC: 0 }, api.bookEntries.markStaleEntries);
export default crons;
```

The cron calls a **mutation** (not an action) because it only writes to the database and doesn't need external I/O. This is the correct Convex pattern.

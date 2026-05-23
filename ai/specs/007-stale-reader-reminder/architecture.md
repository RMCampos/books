# Architecture Notes: Spec 007 — Stale Reader Reminder

## No Schema Changes

`isStale: v.optional(v.boolean())` and `startedAt: v.optional(v.number())` were declared in `book_entries` in spec 002. No migration needed.

## Convex Functions

| Function | Type | File | Purpose |
|----------|------|------|---------|
| `bookEntries.markStaleEntries` | `mutation` | `convex/bookEntries.ts` | Scans all entries; sets/clears `isStale` |
| Cron registration | — | `convex/crons.ts` | Schedules daily call to `markStaleEntries` |

### `markStaleEntries` mutation

```ts
const STALE_THRESHOLD_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export const markStaleEntries = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // No auth guard — this is called by the scheduler, not a user
    const allEntries = await ctx.db.query("book_entries").collect();

    await Promise.all(
      allEntries.map(async (entry) => {
        const isCurrentlyStale =
          entry.status === "currently_reading" &&
          entry.startedAt !== undefined &&
          now - entry.startedAt > STALE_THRESHOLD_MS;

        const shouldUpdate =
          (isCurrentlyStale && !entry.isStale) ||
          (!isCurrentlyStale && entry.isStale);

        if (shouldUpdate) {
          await ctx.db.patch(entry._id, {
            isStale: isCurrentlyStale ? true : undefined,
          });
        }
      })
    );
  },
});
```

**No auth guard** on `markStaleEntries`: this mutation is called by the Convex scheduler (server-to-server), not by a user. There's no identity to check. `ctx.auth.getUserIdentity()` would return `null` in this context — this is expected and correct.

### `updateStatus` integration

When `updateStatus` is called and the new status is not `currently_reading`, clear `isStale`:

```ts
await ctx.db.patch(entryId, {
  status: args.status,
  startedAt: args.status === "currently_reading" ? Date.now() : entry.startedAt,
  finishedAt: args.status === "read" ? Date.now() : entry.finishedAt,
  isStale: args.status !== "currently_reading" ? undefined : entry.isStale,
});
```

### `crons.ts`

```ts
import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "mark stale reading entries",
  { hourUTC: 6, minuteUTC: 0 },
  api.bookEntries.markStaleEntries
);

export default crons;
```

Runs at 06:00 UTC daily. The name ("mark stale reading entries") is displayed in the Convex dashboard.

## Frontend Integration

`BookEntryCard` checks `entry.isStale` from the query result:
- If `isStale === true` and `status === "currently_reading"`, show a warning badge: "Still reading? It's been 30+ days."

The badge should be dismissible (clicking it could prompt the user to update status).

## Important Decisions

- **Mutation, not action**: `markStaleEntries` only reads and writes the DB. Using a `mutation` instead of `action` is correct — actions are for external I/O only.
- **No auth on the scheduler mutation**: server-initiated mutations do not have a user identity. Trying to authenticate would always fail. This is an important Convex concept to internalize.
- **Both set and clear in the same run**: the mutation clears `isStale` from entries that no longer qualify (e.g. user changed status since last run). This keeps the flag consistent without requiring a separate cleanup job.
- **`collect()` full table scan**: acceptable for learning scale. At production scale, add an index on `status` and query only `currently_reading` entries.

## Risks

- Can't write a standard unit test for the cron timing — use the Convex dashboard "Run now" button to trigger manually during development.
- If `markStaleEntries` takes too long (many documents), Convex will time out the mutation. Not an issue at learning scale.

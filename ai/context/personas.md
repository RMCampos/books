# Personas

## The Reader

### Name

Ricardo (representative user)

### Goals

- Keep a single place for all books they want to read, so recommendations don't get lost
- Know at a glance what they're currently reading
- Reflect on books they've finished (rating, short note)
- Organize books loosely by theme or mood (shelves)

### Pain Points

- Recommendations arrive from many sources (friends, articles, podcasts) and are easily forgotten
- No memory of why they added a particular book
- Difficulty distinguishing "want to read someday" from "actively want to read next"

### Main Workflows

1. **Discover and add** — search by title/author, pick a result, it lands in the wishlist as `want_to_read`
2. **Start reading** — change status to `currently_reading`
3. **Finish and reflect** — mark as `read`, add a rating and optional review
4. **Organize** — move entries into shelves to group by topic, mood, or priority
5. **Browse** — filter wishlist by status or shelf to decide what to read next

### Technical Context

- Uses the app on desktop browser primarily
- Expects the UI to feel instant (Convex live queries enable this)
- Not technical — doesn't care how it works, only that it's fast and simple

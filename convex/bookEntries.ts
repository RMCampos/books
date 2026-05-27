import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const getMyWishlist = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return []

    // N+1 per entry — fine at this scale; switch to denormalized coverUrl if perf matters later
    const entries = await ctx.db
      .query('book_entries')
      .withIndex('by_user', (q) => q.eq('userId', identity.subject))
      .collect()

    return Promise.all(
      entries.map(async (entry) => ({
        ...entry,
        book: await ctx.db.get(entry.bookId),
      })),
    )
  },
})

export const addBook = mutation({
  args: {
    title: v.string(),
    author: v.string(),
  },
  handler: async (ctx, { title, author }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthenticated')

    const bookId = await ctx.db.insert('books', { title, author })
    await ctx.db.insert('book_entries', {
      userId: identity.subject,
      bookId,
      status: 'want_to_read',
      addedAt: Date.now(),
    })
  },
})

export const removeBook = mutation({
  args: { entryId: v.id('book_entries') },
  handler: async (ctx, { entryId }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthenticated')

    const entry = await ctx.db.get(entryId)
    if (!entry) throw new Error('Entry not found')
    if (entry.userId !== identity.subject) throw new Error('Unauthorized')

    await ctx.db.delete(entryId)
  },
})

export const updateStatus = mutation({
  args: {
    entryId: v.id('book_entries'),
    status: v.union(
      v.literal('want_to_read'),
      v.literal('currently_reading'),
      v.literal('read'),
    ),
  },
  handler: async (ctx, { entryId, status }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthenticated')

    const entry = await ctx.db.get(entryId)
    if (!entry) throw new Error('Entry not found')
    if (entry.userId !== identity.subject) throw new Error('Unauthorized')

    const patch: Record<string, unknown> = { status }
    if (status === 'currently_reading' && !entry.startedAt) {
      patch.startedAt = Date.now()
    }
    if (status === 'read' && !entry.finishedAt) {
      patch.finishedAt = Date.now()
    }

    await ctx.db.patch(entryId, patch)
  },
})

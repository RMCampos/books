import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const getMyShelves = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return []
    return ctx.db
      .query('shelves')
      .withIndex('by_user', (q) => q.eq('userId', identity.subject))
      .collect()
  },
})

export const createShelf = mutation({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthenticated')
    await ctx.db.insert('shelves', {
      userId: identity.subject,
      name: name.trim(),
      createdAt: Date.now(),
    })
  },
})

export const renameShelf = mutation({
  args: { shelfId: v.id('shelves'), name: v.string() },
  handler: async (ctx, { shelfId, name }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthenticated')
    const shelf = await ctx.db.get(shelfId)
    if (!shelf || shelf.userId !== identity.subject) throw new Error('Unauthorized')
    await ctx.db.patch(shelfId, { name: name.trim() })
  },
})

export const deleteShelf = mutation({
  args: { shelfId: v.id('shelves') },
  handler: async (ctx, { shelfId }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Unauthenticated')
    const shelf = await ctx.db.get(shelfId)
    if (!shelf || shelf.userId !== identity.subject) throw new Error('Unauthorized')

    // Clear shelfId on all entries in this shelf — atomic with the shelf delete below.
    // collect() + batch patch is fine at this scale; at high volume, use pagination.
    const entries = await ctx.db
      .query('book_entries')
      .withIndex('by_user', (q) => q.eq('userId', identity.subject))
      .filter((q) => q.eq(q.field('shelfId'), shelfId))
      .collect()
    await Promise.all(entries.map((e) => ctx.db.patch(e._id, { shelfId: undefined })))

    await ctx.db.delete(shelfId)
  },
})

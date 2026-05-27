import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  shelves: defineTable({
    userId: v.string(),
    name: v.string(),
    createdAt: v.number(),
  }).index('by_user', ['userId']),

  books: defineTable({
    title: v.string(),
    author: v.string(),
    description: v.optional(v.string()),
    isbn: v.optional(v.string()),
    googleBooksId: v.optional(v.string()),
    coverUrl: v.optional(v.string()),
  }),

  book_entries: defineTable({
    userId: v.string(),
    bookId: v.id('books'),
    status: v.union(
      v.literal('want_to_read'),
      v.literal('currently_reading'),
      v.literal('read'),
    ),
    shelfId: v.optional(v.id('shelves')),
    addedAt: v.number(),
    startedAt: v.optional(v.number()),
    finishedAt: v.optional(v.number()),
    rating: v.optional(v.number()),
    review: v.optional(v.string()),
    isStale: v.optional(v.boolean()),
    coverStorageId: v.optional(v.id('_storage')),
  }).index('by_user', ['userId']),
})

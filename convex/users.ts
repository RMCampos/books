import { query } from './_generated/server'

// Returns the Clerk identity of the currently authenticated user.
// Returns null if called without a valid session.
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.auth.getUserIdentity()
  },
})

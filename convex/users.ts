import { v } from "convex/values"
import { query } from "./_generated/server"
import { getUser } from "./utils/auth"

export const getCurrentUser = query({
  handler: async (ctx) => {
    const user = await getUser(ctx)

    return user
  },
})

export const getUserDetailsById = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, { userId }) => {
    return ctx.db
      .query("user")
      .withIndex("by_userId")
      .filter((q) => q.eq(q.field("userId"), userId))
      .unique()
  },
})

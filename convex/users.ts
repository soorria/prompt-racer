import { v } from "convex/values"
import { internalMutation, query } from "./_generated/server"
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

export const updateUserRatings = internalMutation({
  args: {
    updates: v.array(
      v.object({
        userId: v.string(),
        rating: v.number(),
      })
    ),
  },
  handler: async (ctx, { updates }) => {
    const users = await ctx.db
      .query("user")
      .withIndex("by_userId")
      .filter((q) => q.or(...updates.map((u) => q.eq(q.field("userId"), u.userId))))
      .collect()

    const dbIdByUserId = Object.fromEntries(users.map((user) => [user.userId, user._id] as const))

    return Promise.all(
      updates.map(async ({ userId, rating }) => {
        const dbId = dbIdByUserId[userId]

        if (!dbId) {
          return ctx.db.insert("user", {
            rating,
            userId,
          })
        }

        return ctx.db.patch(dbId, {
          rating,
        })
      })
    )
  },
})

export const getLeaderboardPlayers = query({
  handler: async (ctx) => {
    return ctx.db.query("user").withIndex("by_rating").order("desc").take(10)
  },
})


import { createTRPCRouter, publicProcedure } from "~/lib/trpc/trpc"
import { orderBy, schema } from "../db"

// Sort by descending wins
// If tied, sort by games played ascending
// If tied, sort by created_at descending (newer players higher)
export const leaderboardRouter = createTRPCRouter({
  getLeaderboard: publicProcedure
    .query(async ({ ctx }) => {
      const users = await ctx.db.query.users.findMany({
        orderBy: [
          orderBy.desc(schema.users.wins),
          orderBy.asc(schema.users.gamesPlayed),
          orderBy.desc(schema.users.created_at)
        ],
        limit: 100,
      })
      return users
    }),
})

import { type SQL } from "drizzle-orm"
import { z } from "zod"

import { createTRPCRouter, publicProcedure } from "~/lib/trpc/trpc"
import { orderBy, schema } from "../db"

export const leaderboardOrderingSchema = z.enum(["wins", "games-played", "win-rate"])
export type LeaderboardOrdering = z.infer<typeof leaderboardOrderingSchema>

// Sort by descending wins
// If tied, sort by games played ascending
// If tied, sort by created_at descending (newer players higher)
export const leaderboardRouter = createTRPCRouter({
  getLeaderboard: publicProcedure
    .input(
      z.object({
        ordering: leaderboardOrderingSchema,
      }),
    )
    .query(async ({ ctx, input }) => {
      const orderByMap: Record<typeof input.ordering, SQL[]> = {
        wins: [
          orderBy.desc(schema.users.wins),
          orderBy.asc(schema.users.gamesPlayed),
          orderBy.desc(schema.users.inserted_at),
        ],
        "games-played": [
          orderBy.desc(schema.users.gamesPlayed),
          orderBy.desc(schema.users.inserted_at),
        ],
        // TODO: maybe set a lower limit for gamesPlayed to be considered for this ordering
        "win-rate": [
          orderBy.desc(schema.users.winRate),
          orderBy.desc(schema.users.wins),
          orderBy.desc(schema.users.inserted_at),
        ],
      }

      const users = await ctx.db.query.users.findMany({
        orderBy: orderByMap[input.ordering],
        limit: 100,
      })
      return users
    }),
})

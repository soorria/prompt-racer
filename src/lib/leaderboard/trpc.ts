
import { createTRPCRouter, publicProcedure } from "~/lib/trpc/trpc"
import { orderBy, schema } from "../db"
import { z } from "zod"

export const leaderboardRouter = createTRPCRouter({
  getLeaderboard: publicProcedure.input(z.object({
    limit: z.number().min(1).max(10),
    cursor: z.number().nullish(),
  })).query(async ({ ctx, input }) => {
    const limit = input.limit ?? 10;
    const { cursor } = input;

    const users = await ctx.db.query.users.findMany({
      orderBy: [orderBy.desc(schema.users.wins), orderBy.asc(schema.users.name)],
      limit: limit + 1,
      offset: cursor ?? 0,
    })

    const hasNextPage = users.length > limit;

    return {
      users: hasNextPage ? users.slice(0, limit) : users,
      cursor: hasNextPage ? (cursor ?? 0) : null,
    }
  }),
})
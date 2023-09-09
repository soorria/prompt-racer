import "@total-typescript/ts-reset"
import { query } from "./_generated/server"
import { getUserId } from "./utils/auth"

export const getMyGames = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error("Not logged in")
    }
    const userId = getUserId(identity)

    const gameInfos = await ctx.db
      .query("playerGameInfo")
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("desc")
      .take(20)

    const games = await Promise.all(gameInfos.map((info) => ctx.db.get(info.gameId)))

    return { games: games.filter(Boolean) }
  },
})

import "@total-typescript/ts-reset"
import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server"
import { api, internal, fullApi } from "./_generated/api"

import { v } from "convex/values"
import { getUserId, requireUser } from "./utils/auth"
import ms from "ms"
import { addMilliseconds } from "date-fns"
import { t } from "./utils/handler"

export const getMyGames = query({
  handler: t(async (ctx) => {
    const { userId } = await requireUser(ctx)

    const gameInfos = await ctx.db
      .query("playerGameInfo")
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("desc")
      .take(20)

    const games = await Promise.all(gameInfos.map((info) => ctx.db.get(info.gameId)))

    return { games: games.filter(Boolean) }
  }),
})

export const getLatestGameForUser = internalQuery({
  args: { userId: v.string() },
  handler: t(async (ctx, args) => {
    const [latestGameInfoForUser] = await ctx.db
      .query("playerGameInfo")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .take(1)
    const game = await ctx.db.get(latestGameInfoForUser.gameId)

    return game
  }),
})

export const createNewGame = internalMutation({
  args: { creatorUserId: v.string() },
  handler: t(async (ctx, args) => {
    const gameId = await ctx.db.insert("game", {
      creatorId: args.creatorUserId,
      mode: "fastest-player",
      state: "waiting-for-players",
      question: {
        description: "Do le two sum",
      },
      gameStartTime: addMilliseconds(new Date(), GAME_TIMINGS.waitingForPlayers).toISOString(),
      gameEndTime: addMilliseconds(
        new Date(),
        GAME_TIMINGS.waitingForPlayers + GAME_TIMINGS.playTime
      ).toISOString(),
    })

    return { gameId }
  }),
})

export const getGame = query({
  args: { gameId: v.id("game") },
  handler: t(async (ctx, args) => {
    const game = await ctx.db.get(args.gameId)
    return { game }
  }),
})

export const patchGameState = internalMutation({
  args: {
    gameId: v.id("game"),
    state: v.union(
      v.literal("waiting-for-players"),
      v.literal("in-progress"),
      v.literal("finished")
    ),
  },
  handler: t(async (ctx, args) => {
    await ctx.db.patch(args.gameId, {
      state: args.state,
    })
  }),
})

export const advanceGameState = internalAction({
  args: { gameId: v.id("game") },
  handler: async (ctx, args) => {
    const gameResult = await ctx.runQuery(api.games.getGame, { gameId: args.gameId })

    if (!gameResult.success || !gameResult.data.game) {
      return
    }

    const game = gameResult.data.game

    if (game.state === "waiting-for-players") {
      await ctx.runMutation(internal.games.patchGameState, {
        gameId: args.gameId,
        state: "in-progress",
      })
      await ctx.scheduler.runAfter(GAME_TIMINGS.playTime, internal.games.advanceGameState, args)
    } else if (game.state === "in-progress") {
      await ctx.runMutation(internal.games.patchGameState, {
        gameId: args.gameId,
        state: "finished",
      })
    }
  },
})

const GAME_TIMINGS = {
  waitingForPlayers: ms("1m"),
  playTime: ms("10m"),
}

export const createGame = action({
  args: {},
  handler: async (ctx, args) => {
    const { userId } = await requireUser(ctx)

    const gameResult = await ctx.runQuery(internal.games.getLatestGameForUser, { userId })

    if (!gameResult.success || !gameResult.data) {
      throw new Error("You're already in an active game")
    }

    const newGameResult = await ctx.runMutation(internal.games.createNewGame, {
      creatorUserId: userId,
    })

    // if (!newGameResult.success) {
    //   return newGameResult
    // }

    // schedule advancing
    await ctx.scheduler.runAfter(GAME_TIMINGS.waitingForPlayers, internal.games.advanceGameState, {
      gameId: gameResult.data._id,
    })
  },
})

export const cancelGame = mutation({
  args: {
    gameId: v.id("game"),
  },

  handler: async (ctx, args) => {
    const { userId } = await requireUser(ctx)

    const game = await ctx.db.get(args.gameId)
    if (!game) {
      throw new Error("Game not found")
    }

    if (game.state !== "waiting-for-players") {
      throw new Error("Game is not waiting for players")
    }
  },
})

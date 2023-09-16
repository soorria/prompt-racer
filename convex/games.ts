import "@total-typescript/ts-reset"
import {
  QueryCtx,
  action,
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server"
import { api, internal } from "./_generated/api"

import { v } from "convex/values"
import { getUser, requireUser } from "./utils/auth"
import ms from "ms"
import {
  addMilliseconds,
  addSeconds,
  formatDuration,
  intervalToDuration,
  isAfter,
  isBefore,
  isEqual,
} from "date-fns"
import { Id } from "./_generated/dataModel"
import { chatHistoryItem, chatHistorySingleItem } from "./utils/schema"

export const getMyGames = query({
  handler: async (ctx) => {
    const { userId } = await requireUser(ctx)

    const gameInfos = await ctx.db
      .query("playerGameInfo")
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("desc")
      .take(20)

    const games = await Promise.all(gameInfos.map((info) => ctx.db.get(info.gameId)))

    return { games: games.filter(Boolean) }
  },
})

const _getLatestActiveGameForUser = async (ctx: QueryCtx, userId: string) => {
  const [latestGameInfoForUser] = await ctx.db
    .query("playerGameInfo")
    .filter((q) => q.eq(q.field("userId"), userId))
    .order("desc")
    .take(1)

  if (!latestGameInfoForUser) {
    return null
  }

  const game = await ctx.db.get(latestGameInfoForUser.gameId)

  const state = game?.state

  if (!game || state === "finished" || state === "cancelled") {
    return null
  }

  return {
    ...game,
    state: state!,
  }
}

export const getLatestActiveGameForUser = internalQuery({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return _getLatestActiveGameForUser(ctx, args.userId)
  },
})

export const getLatestActiveGameForAuthedUser = query({
  handler: async (ctx) => {
    const { userId } = await requireUser(ctx)
    return _getLatestActiveGameForUser(ctx, userId)
  },
})

export const createNewGame = internalMutation({
  args: { creatorUserId: v.string() },
  handler: async (ctx, args) => {
    const gameId = await ctx.db.insert("game", {
      creatorId: args.creatorUserId,
      mode: "fastest-player",
      state: "waiting-for-players",
      question: {
        description: "Do le two sum",
      },
      gameStartTime: addMilliseconds(new Date(), GAME_TIMINGS_MS.waitingForPlayers).getTime(),
      gameEndTime: addMilliseconds(
        new Date(),
        GAME_TIMINGS_MS.waitingForPlayers + GAME_TIMINGS_MS.playTime
      ).getTime(),
    })

    return { gameId }
  },
})

export const getGame = query({
  args: { gameId: v.string() },
  handler: async (ctx, args) => {
    const gameId = ctx.db.normalizeId("game", args.gameId)
    if (!gameId) return null
    const game = await ctx.db.get(gameId)

    return game
  },
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
  handler: async (ctx, args) => {
    await ctx.db.patch(args.gameId, {
      state: args.state,
    })
  },
})

export const advanceGameState = internalAction({
  args: { gameId: v.id("game") },
  handler: async (ctx, args) => {
    const game = await ctx.runQuery(api.games.getGame, { gameId: args.gameId })

    if (!game) {
      return
    }

    if (game.state === "waiting-for-players") {
      await ctx.runMutation(internal.games.patchGameState, {
        gameId: args.gameId,
        state: "in-progress",
      })
      await ctx.scheduler.runAfter(GAME_TIMINGS_MS.playTime, internal.games.advanceGameState, args)
    } else if (game.state === "in-progress") {
      await ctx.runMutation(internal.games.patchGameState, {
        gameId: args.gameId,
        state: "finished",
      })
    }
  },
})

const GAME_TIMINGS_MS = {
  waitingForPlayers: ms("1m"),
  playTime: ms("5m"),
  promptRateLimitTime: ms("10s"),
}

export const createGame = internalAction({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const newGameResult = await ctx.runMutation(internal.games.createNewGame, {
      creatorUserId: args.userId,
    })

    // schedule advancing
    await ctx.scheduler.runAfter(
      GAME_TIMINGS_MS.waitingForPlayers,
      internal.games.advanceGameState,
      {
        gameId: newGameResult.gameId,
      }
    )

    const gameId = newGameResult.gameId as Id<"game">

    return { gameId }
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

    if (game.creatorId !== userId) {
      throw new Error("Only the creator can cancel the game")
    }

    if (game.state !== "waiting-for-players") {
      throw new Error("Game cannot be cancelled in this state")
    }

    await ctx.db.patch(args.gameId, {
      state: "cancelled",
    })
  },
})

export const getWaitingGames = query({
  handler: async (ctx) => {
    const games = await ctx.db
      .query("game")
      .filter((q) => q.eq(q.field("state"), "waiting-for-players"))
      .order("desc")
      .take(20)

    return games
  },
})

export const joinGame = action({
  handler: async (ctx) => {
    const { userId } = await requireUser(ctx)

    const currentGame = await ctx.runQuery(internal.games.getLatestActiveGameForUser, { userId })
    if (currentGame) {
      throw new Error("You're already in an active game")
    }

    const games = await ctx.runQuery(api.games.getWaitingGames)
    let gameToJoin = games[Math.floor(Math.random() * games.length)]

    if (!gameToJoin) {
      const { gameId } = await ctx.runAction(internal.games.createGame, {
        userId,
      })
      const newGame = await ctx.runQuery(api.games.getGame, { gameId })
      if (!newGame) {
        throw new Error("Failed to create game")
      }
      gameToJoin = newGame
    }

    // this is to get around the types being a little dumb :(
    const gameId = gameToJoin._id as Id<"game">

    await ctx.runMutation(internal.games.createPlayerInfoForGame, {
      gameId,
      userId,
      startingCode: `
def solution(numbers, target):
    ...
`.trim(),
    })

    return { gameId }
  },
})

export const createPlayerInfoForGame = internalMutation({
  args: {
    gameId: v.id("game"),
    userId: v.string(),
    startingCode: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("playerGameInfo", {
      gameId: args.gameId,
      userId: args.userId,
      state: "playing",
      code: args.startingCode,
      chatHistory: [],
    })
  },
})

export const getPlayerGameInfo = internalQuery({
  args: {
    gameId: v.id("game"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const gamePlayerInfo = await ctx.db
      .query("playerGameInfo")
      .filter((q) =>
        q.and(q.eq(q.field("gameId"), args.gameId), q.eq(q.field("userId"), args.userId))
      )
      .unique()

    return gamePlayerInfo
  },
})

export const sendMessageForPlayerInGame = action({
  args: {
    gameId: v.id("game"),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireUser(ctx)
    const [game, playerGameInfo] = await Promise.all([
      ctx.runQuery(api.games.getGame, { gameId: args.gameId }),
      ctx.runQuery(internal.games.getPlayerGameInfo, {
        gameId: args.gameId,
        userId,
      }),
    ])

    if (!game) {
      throw new Error("Game not found")
    }
    if (!playerGameInfo) {
      throw new Error("Player not found in game")
    }

    // if (game.state !== "in-progress") {
    //   throw new Error("Game is not in progress")
    // }

    const history = playerGameInfo.chatHistory || []
    const lastMessage = history.at(-1)
    if (lastMessage?.role === "user" || lastMessage?.parsed.state === "generating") {
      throw new Error("You can't send a message until the AI responds")
    }

    const now = new Date()
    const lastPromptedAt = playerGameInfo.lastPromptedAt
      ? new Date(playerGameInfo.lastPromptedAt)
      : null
    const nextPromptableAt = lastPromptedAt
      ? addMilliseconds(lastPromptedAt, GAME_TIMINGS_MS.promptRateLimitTime)
      : null

    const canPrompt =
      // no lastPromptedAt means we can prompt
      !nextPromptableAt || isAfter(now, nextPromptableAt) || isEqual(now, nextPromptableAt)

    if (!canPrompt) {
      throw new Error(
        `You can't prompt the AI yet. Please wait ${formatDuration(
          intervalToDuration({
            start: now,
            end: nextPromptableAt,
          }),
          { format: ["seconds"] }
        )}`
      )
    }

    await Promise.all([
      ctx.runMutation(internal.games.pushNewMessages, {
        playerGameInfoId: playerGameInfo._id,
        messages: [
          {
            role: "user",
            content: args.message,
          },
          {
            role: "ai",
            content: "Generating...",
            parsed: {
              state: "generating",
            },
          },
        ],
      }),
      ctx.runMutation(internal.games.setPlayerGameInfoLastPrompedAt, {
        playerGameInfoId: playerGameInfo._id,
        lastPromptedAt: now.getTime(),
      }),
    ])

    await ctx.scheduler.runAfter(0, internal.openai.codeGeneration, {
      currentCode: playerGameInfo.code,
      playerGameInfoId: playerGameInfo._id,
      message: args.message,
    })
  },
})

export const setPlayerGameInfoLastPrompedAt = internalMutation({
  args: {
    playerGameInfoId: v.id("playerGameInfo"),
    lastPromptedAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.playerGameInfoId, {
      lastPromptedAt: args.lastPromptedAt,
    })
  },
})

export const pushNewMessages = internalMutation({
  args: {
    playerGameInfoId: v.id("playerGameInfo"),
    messages: v.array(chatHistoryItem),
  },
  handler: async (ctx, args) => {
    const playerGameInfo = await ctx.db.get(args.playerGameInfoId)
    if (!playerGameInfo) {
      throw new Error("Player not found in game")
    }

    playerGameInfo.chatHistory.push(...args.messages)

    await ctx.db.patch(args.playerGameInfoId, {
      chatHistory: playerGameInfo.chatHistory,
    })
  },
})

export const getGameInfoForUser = query({
  args: {
    gameId: v.string(),
  },
  handler: async (ctx, args) => {
    const [user, game] = await Promise.all([
      getUser(ctx),
      (async () => {
        const gameId = ctx.db.normalizeId("game", args.gameId)
        const game = gameId && (await ctx.db.get(gameId))
        return game
      })(),
    ])

    const allPlayerGameInfos =
      game?.state === "finished"
        ? await ctx.db
            .query("playerGameInfo")
            .filter((q) => q.eq(q.field("gameId"), args.gameId))
            .collect()
        : null

    const currentPlayerInfo =
      allPlayerGameInfos && user
        ? allPlayerGameInfos?.find((info) => info.userId === user?.userId)
        : await ctx.db
            .query("playerGameInfo")
            .filter((q) =>
              q.and(q.eq(q.field("gameId"), args.gameId), q.eq(q.field("userId"), user?.userId))
            )
            .unique()

    return {
      game,
      currentPlayerInfo,
      allPlayerGameInfos,
    }
  },
})

export const setAgentMessageForPlayerInGame = internalMutation({
  args: {
    playerGameInfoId: v.id("playerGameInfo"),
    data: v.union(
      v.object({
        type: v.literal("partial"),
        message: v.string(),
      }),
      v.object({
        type: v.literal("success"),
        message: v.string(),
      }),
      v.object({
        type: v.literal("error"),
        message: v.string(),
        raw: v.any(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const playerGameInfo = await ctx.db.get(args.playerGameInfoId)
    if (!playerGameInfo) {
      throw new Error("Player not found in game")
    }

    const history = playerGameInfo.chatHistory
    const lastMessage = history.at(-1)

    if (!lastMessage || lastMessage.role !== "ai") {
      return
    }

    if (args.data.type === "partial") {
      lastMessage.content = args.data.message
    } else if (args.data.type === "success") {
      lastMessage.content = args.data.message

      const openingTagIndex = lastMessage.content.indexOf("<code>")
      // TODO: should we do lastIndexOf?
      const closingTagIndex = lastMessage.content.indexOf("</code>")

      if (openingTagIndex === -1) {
        lastMessage.parsed = {
          state: "error",
          error: "Could not find code in AI response",
          raw: null,
        }
      } else {
        const code = lastMessage.content
          .slice(
            openingTagIndex + "<code>".length,
            closingTagIndex === -1 ? undefined : closingTagIndex
          )
          .trim()
        lastMessage.parsed = {
          state: "success",
          code,
        }
      }
    } else if (args.data.type === "error") {
      lastMessage.content = args.data.message
      lastMessage.parsed = {
        state: "error",
        error: args.data.message,
        raw: args.data.raw,
      }
    }

    if (lastMessage.parsed.state === "success") {
      playerGameInfo.code = lastMessage.parsed.code
    }

    await ctx.db.patch(args.playerGameInfoId, {
      chatHistory: history,
      code: playerGameInfo.code,
    })
  },
})

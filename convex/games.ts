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
import { dequal } from "dequal"
import { api, internal } from "./_generated/api"

import { v, ConvexError } from "convex/values"
import { getUser, requireUser } from "./utils/auth"
import ms from "ms"
import {
  addMilliseconds,
  formatDuration,
  intervalToDuration,
  isAfter,
  isEqual,
  max,
} from "date-fns"
import { Doc, Id } from "./_generated/dataModel"
import {
  CodeRunResult,
  chatHistoryItem,
  gameModeSchema,
  gameModes,
  gamePlayer,
  playerGameInfoTestState,
} from "./utils/schema"
import {
  PlayerPostionsResult,
  getPlayerPostionsForGameMode,
  getUpdatedPlayerPostions,
} from "./utils/games"
import { elo } from "./utils/elo"
import { DEFAULT_RATING, GAME_TIMINGS_MS } from "./utils/game_settings"

export const getMyGames = query({
  handler: async (ctx) => {
    const { userId } = await requireUser(ctx)

    const gameInfos = await ctx.db
      .query("playerGameInfo")
      .withIndex("by_userId")
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("desc")
      .take(20)

    const games = await Promise.all(gameInfos.map((info) => ctx.db.get(info.gameId)))

    return { games: games.filter(Boolean).map((g) => removeGameDetailsBasedOnState(g)) }
  },
})

const removeGameDetailsBasedOnState = (game: Doc<"game">) => {
  if (game.state !== "finished") {
    const { test_cases: _, ...rest } = game.question
    return {
      ...game,
      question: rest,
    }
  }
  return game
}

const _getLatestActiveGameForUser = async (ctx: QueryCtx, userId: string) => {
  const [latestGameInfoForUser] = await ctx.db
    .query("playerGameInfo")
    .withIndex("by_userId")
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
    ...removeGameDetailsBasedOnState(game),
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
  args: { creatorUserId: v.string(), questionId: v.id("question"), mode: gameModeSchema },
  handler: async (ctx, args) => {
    const dbQuestion = await ctx.db.get(args.questionId)

    if (!dbQuestion) {
      throw new ConvexError("Question not found")
    }

    const nTestsForExample = Math.floor(0.4 * dbQuestion.test_cases.length)

    const { _id, _creationTime, ...questionPartsForGame } = dbQuestion

    const gameId = await ctx.db.insert("game", {
      creatorId: args.creatorUserId,
      mode: "fastest-player",
      state: "waiting-for-players",
      question: {
        ...questionPartsForGame,
        examples: dbQuestion.test_cases.slice(0, nTestsForExample),
      },
      gameStartTime: addMilliseconds(new Date(), GAME_TIMINGS_MS.waitingForPlayers).getTime(),
      gameEndTime: addMilliseconds(
        new Date(),
        GAME_TIMINGS_MS.waitingForPlayers + GAME_TIMINGS_MS.playTime
      ).getTime(),
      players: [],
    })

    return { gameId }
  },
})

export const getFullGame = internalQuery({
  args: { gameId: v.id("game") },
  handler: async (ctx, args) => {
    const gameId = ctx.db.normalizeId("game", args.gameId)
    if (!gameId) return null
    const game = await ctx.db.get(gameId)
    return game
  },
})

export const getGame = query({
  args: { gameId: v.string() },
  handler: async (ctx, args) => {
    const gameId = ctx.db.normalizeId("game", args.gameId)
    if (!gameId) return null
    const game = await ctx.db.get(gameId)

    return game && removeGameDetailsBasedOnState(game)
  },
})

export const patchGame = internalMutation({
  args: {
    gameId: v.id("game"),
    updates: v.object({
      state: v.optional(
        v.union(
          v.literal("waiting-for-players"),
          v.literal("in-progress"),
          v.literal("finalising"),
          v.literal("finished")
        )
      ),
      players: v.optional(v.array(gamePlayer)),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.gameId, args.updates)
  },
})

export const getPlayerInfosForGame = internalQuery({
  args: { gameId: v.id("game") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("playerGameInfo")
      .withIndex("by_gameId")
      .filter((q) => q.eq(q.field("gameId"), args.gameId))
      .collect()
  },
})

export const advanceGameState = internalAction({
  args: { gameId: v.id("game") },
  handler: async (ctx, args) => {
    const game = await ctx.runQuery(api.games.getGame, { gameId: args.gameId })

    if (!game || !game.players?.length) {
      return
    }

    if (game.state === "waiting-for-players") {
      await ctx.runMutation(internal.games.patchGame, {
        gameId: args.gameId,
        updates: { state: "in-progress" },
      })
      await ctx.scheduler.runAfter(GAME_TIMINGS_MS.playTime, internal.games.advanceGameState, args)
    } else if (game.state === "in-progress") {
      await ctx.runMutation(internal.games.patchGame, {
        gameId: args.gameId,
        updates: { state: "finalising" },
      })

      // 2s delay just to wait for any leftover code to finish
      await new Promise((resolve) => setTimeout(resolve, 2_000))

      const playerInfos = await ctx.runQuery(internal.games.getPlayerInfosForGame, {
        gameId: game._id,
      })

      const positions = getPlayerPostionsForGameMode(game.mode, playerInfos)
      const playersWithPositions = getUpdatedPlayerPostions([...(game.players ?? [])], positions)

      const initialPlayerRatings = playersWithPositions.map(
        (p) => p.starting_rating ?? DEFAULT_RATING
      )
      const maxPosition = Math.max(
        ...playersWithPositions.map((p) => (typeof p.position === "number" ? p.position : 0))
      )
      const updatedRatings =
        initialPlayerRatings.length > 1
          ? elo.getNewRatings(
              initialPlayerRatings,
              playersWithPositions.map((p) =>
                typeof p.position === "number" ? p.position : maxPosition + 1
              )
            )
          : initialPlayerRatings
      const playersWithEndingRatings = playersWithPositions.map((p, i) => ({
        ...p,
        ending_rating: updatedRatings[i],
      }))

      const updates = playersWithEndingRatings.map((p) => ({
        userId: p.userId,
        rating: p.ending_rating!,
      }))

      await Promise.all([
        ctx.runMutation(internal.games.patchGame, {
          gameId: args.gameId,
          updates: { state: "finished", players: playersWithEndingRatings },
        }),
        ctx.runMutation(internal.users.updateUserRatings, {
          updates,
        }),
      ])
    }
  },
})

export const createGame = internalAction({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const questionIds = await ctx.runQuery(internal.questions.getQuestionIds)

    const questionId = questionIds[Math.floor(Math.random() * questionIds.length)]!
    const gameMode = gameModes[Math.floor(Math.random() * gameModes.length)]!

    const newGameResult = await ctx.runMutation(internal.games.createNewGame, {
      creatorUserId: args.userId,
      questionId,
      mode: gameMode,
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
      throw new ConvexError("Game not found")
    }

    if (game.creatorId !== userId) {
      throw new ConvexError("Only the creator can cancel the game")
    }

    if (game.state !== "waiting-for-players") {
      throw new ConvexError("Game cannot be cancelled in this state")
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

export const endGameEarlyIfPossible = internalAction({
  args: { gameId: v.id("game") },
  handler: async (ctx, args) => {
    const game = await ctx.runQuery(internal.games.getFullGame, { gameId: args.gameId })

    if (!game || game.state !== "in-progress") {
      return
    }

    const playerInfos = await ctx.runQuery(internal.games.getPlayerInfosForGame, {
      gameId: args.gameId,
    })

    const allSubmitted = playerInfos.every((info) => info.testState?.type === "complete")

    if (allSubmitted) {
      await ctx.runAction(internal.games.advanceGameState, {
        gameId: args.gameId,
      })
    }
  },
})

export const joinGame = action({
  handler: async (ctx) => {
    const { userId, identity } = await requireUser(ctx)

    const currentGame = await ctx.runQuery(internal.games.getLatestActiveGameForUser, { userId })
    if (currentGame) {
      throw new ConvexError("You're already in an active game")
    }

    const [games, userDetails] = await Promise.all([
      ctx.runQuery(api.games.getWaitingGames),
      ctx.runQuery(api.users.getUserDetailsById, { userId }),
    ])
    let gameToJoin = games[Math.floor(Math.random() * games.length)]

    if (!gameToJoin) {
      const { gameId } = await ctx.runAction(internal.games.createGame, {
        userId,
      })
      const newGame = await ctx.runQuery(api.games.getGame, { gameId })
      if (!newGame) {
        throw new ConvexError("Failed to create game")
      }
      gameToJoin = newGame as Doc<"game">
    }

    // this is to get around the types being a little dumb :(
    const gameId = gameToJoin._id as Id<"game">

    await Promise.all([
      ctx.runMutation(internal.games.createPlayerInfoForGame, {
        gameId,
        userId,
        startingCode: gameToJoin.question.starting_code,
      }),
      ctx.runMutation(internal.games.patchGame, {
        gameId,
        updates: {
          players: [
            ...(gameToJoin.players || []),
            {
              name:
                identity.preferredUsername ||
                identity.name ||
                identity.givenName ||
                `Anonymouse #${
                  (gameToJoin.players?.filter((p) => p.name.startsWith("Anonymouse #")).length ??
                    0) + 1
                }`,
              userId,
              profilePictureUrl:
                identity.profileUrl || identity.pictureUrl || "https://soorria.com/logo.png",
              starting_rating: userDetails?.rating ?? DEFAULT_RATING,
            },
          ],
        },
      }),
    ])

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
      .withIndex("by_gameId_userId")
      .filter((q) =>
        q.and(q.eq(q.field("gameId"), args.gameId), q.eq(q.field("userId"), args.userId))
      )
      .unique()

    return gamePlayerInfo
  },
})

export const leaveGame = mutation({
  args: {
    gameId: v.id("game"),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireUser(ctx)

    const playerGameInfoRecord = await ctx.db
      .query("playerGameInfo")
      .withIndex("by_gameId_userId")
      .filter((q) => q.and(q.eq(q.field("gameId"), args.gameId), q.eq(q.field("userId"), userId)))
      .unique()

    if (!playerGameInfoRecord) {
      throw new ConvexError("You're not part of this game or the game doesn't exist.")
    }

    await ctx.db.delete(playerGameInfoRecord._id)

    const otherPlayerRecords = await ctx.db
      .query("playerGameInfo")
      .withIndex("by_gameId")
      .filter((q) => q.and(q.eq(q.field("gameId"), args.gameId)))
      .take(1)

    if (otherPlayerRecords.length === 0) {
      await ctx.db.delete(args.gameId)
    }

    const game = await ctx.db.get(args.gameId)
    if (game) {
      await ctx.db.patch(args.gameId, {
        players: game?.players?.filter((p) => p.userId !== userId) ?? [],
      })
    }

    return { success: true }
  },
})

export const sendMessageForPlayerInGame = action({
  args: {
    gameId: v.id("game"),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.message.length > 40) {
      throw new ConvexError("Message too long. Maximum message length is 40 characters.")
    }

    const { userId } = await requireUser(ctx)
    const [game, playerGameInfo] = await Promise.all([
      ctx.runQuery(api.games.getGame, { gameId: args.gameId }),
      ctx.runQuery(internal.games.getPlayerGameInfo, {
        gameId: args.gameId,
        userId,
      }),
    ])

    if (!game) {
      throw new ConvexError("Game not found")
    }
    if (!playerGameInfo) {
      throw new ConvexError("Player not found in game")
    }

    if (game.state !== "in-progress") {
      throw new ConvexError("Game is not in progress")
    }

    const history = playerGameInfo.chatHistory || []
    const lastMessage = history.at(-1)
    if (
      lastMessage?.role === "user" ||
      (lastMessage?.role === "ai" && lastMessage?.parsed.state === "generating")
    ) {
      throw new ConvexError("You can't send a message until the AI responds")
    }

    const now = new Date()
    const lastPromptedAt = playerGameInfo.lastPromptedAt
      ? new Date(playerGameInfo.lastPromptedAt)
      : null
    const nextPromptableAt = lastPromptedAt
      ? addMilliseconds(lastPromptedAt, GAME_TIMINGS_MS.promptRateLimitTime)
      : null

    const canPromptBasedOnRateLimit =
      // no lastPromptedAt means we can prompt
      !nextPromptableAt || isAfter(now, nextPromptableAt) || isEqual(now, nextPromptableAt)
    const canPromptBasedOnState = game.state === "in-progress"
    const canPrompt = canPromptBasedOnRateLimit && canPromptBasedOnState

    if (!canPrompt) {
      if (!canPromptBasedOnRateLimit) {
        throw new ConvexError(
          `You can't prompt the AI yet. Please wait ${formatDuration(
            intervalToDuration({
              start: now,
              end: nextPromptableAt,
            }),
            { format: ["seconds"] }
          )}`
        )
      }

      throw new ConvexError("The game is not in progress.")
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
              maybeCode: "",
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
      throw new ConvexError("Player not found in game")
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
            .withIndex("by_gameId")
            .filter((q) => q.eq(q.field("gameId"), args.gameId))
            .collect()
        : null

    const currentPlayerInfo =
      allPlayerGameInfos && user
        ? allPlayerGameInfos?.find((info) => info.userId === user?.userId)
        : await ctx.db
            .query("playerGameInfo")
            .withIndex("by_gameId_userId")
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
      throw new ConvexError("Player not found in game")
    }

    const history = playerGameInfo.chatHistory
    const lastMessage = history.at(-1)

    if (!lastMessage || lastMessage.role !== "ai") {
      return
    }

    const extractCode = (content: string) => {
      const openingTagIndex = content.indexOf("<code>")
      // TODO: should we do lastIndexOf?
      const closingTagIndex = content.indexOf("</code>")

      if (openingTagIndex === -1) {
        return null
      }

      return content
        .slice(
          openingTagIndex + "<code>".length,
          closingTagIndex === -1 ? undefined : closingTagIndex
        )
        .trim()
    }

    if (args.data.type === "partial") {
      lastMessage.content = args.data.message
      lastMessage.parsed = {
        state: "generating",
        maybeCode: extractCode(args.data.message) || args.data.message,
      }
    } else if (args.data.type === "success") {
      lastMessage.content = args.data.message

      const code = extractCode(lastMessage.content)

      if (code === null) {
        lastMessage.parsed = {
          state: "error",
          error: "Could not find code in AI response",
          raw: null,
        }
      } else {
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

export const patchPlayerGameInfo = internalMutation({
  args: {
    playerGameInfoId: v.id("playerGameInfo"),
    updates: v.object({
      lastTestedAt: v.optional(v.number()),
      testState: v.optional(playerGameInfoTestState),
      state: v.optional(v.literal("submitted")),

      lastSubmittedAt: v.optional(v.number()),
      submissionState: v.optional(playerGameInfoTestState),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.playerGameInfoId, args.updates)
  },
})

export const submitCode = action({
  args: {
    gameId: v.id("game"),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireUser(ctx)

    const [playerGameInfo, game] = await Promise.all([
      ctx.runQuery(internal.games.getPlayerGameInfo, {
        gameId: args.gameId,
        userId,
      }),
      ctx.runQuery(internal.games.getFullGame, { gameId: args.gameId }),
    ])

    if (!game) {
      throw new ConvexError("Game not found")
    }

    if (!playerGameInfo) {
      throw new ConvexError("Player not found in game")
    }

    if (game.state !== "in-progress") {
      throw new ConvexError("Game is not in progress")
    }

    const now = new Date()
    const lastSubmittedAt = playerGameInfo.lastSubmittedAt
      ? new Date(playerGameInfo.lastSubmittedAt)
      : null
    const nextSubmittableAt = lastSubmittedAt
      ? addMilliseconds(lastSubmittedAt, GAME_TIMINGS_MS.promptRateLimitTime)
      : null
    const canSubmitBasedOnRateLimit =
      // no lastSubmittedAt means we can submit
      !nextSubmittableAt || isAfter(now, nextSubmittableAt) || isEqual(now, nextSubmittableAt)

    if (!canSubmitBasedOnRateLimit) {
      throw new ConvexError(
        `You can't submit your code yet. Please wait ${formatDuration(
          intervalToDuration({
            start: now,
            end: nextSubmittableAt,
          }),
          { format: ["seconds"] }
        )}`
      )
    }

    await ctx.runMutation(internal.games.patchPlayerGameInfo, {
      playerGameInfoId: playerGameInfo._id,
      updates: {
        state: "submitted",
        submissionState: {
          type: "running",
        },
        lastSubmittedAt: now.getTime(),
      },
    })

    const rawResults = await ctx.runAction(internal.codeExecution.runPythonCode, {
      code: playerGameInfo.code,
      args_list: game.question.test_cases.map((tc) => tc.args),
    })
    const resultsAfterChecking = rawResults.map((result, i): CodeRunResult => {
      if (result.status === "success") {
        // check expected
        const expected = game.question.test_cases[i]!.expected
        if (dequal(result.result, expected)) {
          return {
            status: "success",
            result: result.result,
          }
        } else {
          return {
            status: "error",
            reason: {
              name: "AssertionError",
              message: `Expected ${JSON.stringify(expected)} but got ${JSON.stringify(
                result.result
              )}`,
            },
          }
        }
      } else {
        return result
      }
    })

    await ctx.runMutation(internal.games.patchPlayerGameInfo, {
      playerGameInfoId: playerGameInfo._id,
      updates: {
        submissionState: {
          type: "complete",
          results: resultsAfterChecking,
        },
      },
    })

    // update postions
    const playerInfos = await ctx.runQuery(internal.games.getPlayerInfosForGame, {
      gameId: game._id,
    })
    const positions = getPlayerPostionsForGameMode(game.mode, playerInfos)
    const playersWithPositions = getUpdatedPlayerPostions([...(game.players ?? [])], positions)

    await ctx.runMutation(internal.games.patchGame, {
      gameId: args.gameId,
      updates: { players: playersWithPositions },
    })

    await ctx.runAction(internal.games.endGameEarlyIfPossible, { gameId: args.gameId })
  },
})

export const runTests = action({
  args: {
    gameId: v.id("game"),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireUser(ctx)

    const [playerGameInfo, game] = await Promise.all([
      ctx.runQuery(internal.games.getPlayerGameInfo, {
        gameId: args.gameId,
        userId,
      }),
      ctx.runQuery(internal.games.getFullGame, { gameId: args.gameId }),
    ])

    if (!game) {
      throw new ConvexError("Game not found")
    }

    if (!playerGameInfo) {
      throw new ConvexError("Player not found in game")
    }

    if (game.state !== "in-progress") {
      throw new ConvexError("Game is not in progress")
    }

    const now = new Date()
    const lastTestedAt = playerGameInfo.lastTestedAt ? new Date(playerGameInfo.lastTestedAt) : null
    const nextTestableAt = lastTestedAt
      ? addMilliseconds(lastTestedAt, GAME_TIMINGS_MS.promptRateLimitTime)
      : null

    const canTestBasedOnRateLimit =
      // no lastTestedAt means we can test
      !nextTestableAt || isAfter(now, nextTestableAt) || isEqual(now, nextTestableAt)

    if (!canTestBasedOnRateLimit) {
      throw new ConvexError(
        `You can't test your code yet. Please wait ${formatDuration(
          intervalToDuration({
            start: now,
            end: nextTestableAt,
          }),
          { format: ["seconds"] }
        )}`
      )
    }

    await ctx.runMutation(internal.games.patchPlayerGameInfo, {
      playerGameInfoId: playerGameInfo._id,
      updates: {
        lastTestedAt: now.getTime(),
        testState: {
          type: "running",
        },
      },
    })

    const rawResults = await ctx.runAction(internal.codeExecution.runPythonCode, {
      code: playerGameInfo.code,
      args_list: game.question.examples.map((tc) => tc.args),
    })
    const resultsAfterChecking = rawResults.map((result, i): CodeRunResult => {
      if (result.status === "success") {
        // check expected
        const expected = game.question.examples[i]!.expected
        if (dequal(result.result, expected)) {
          return {
            status: "success",
            result: result.result,
          }
        } else {
          return {
            status: "error",
            reason: {
              name: "AssertionError",
              message: `Expected ${JSON.stringify(expected)} but got ${JSON.stringify(
                result.result
              )}`,
            },
          }
        }
      } else {
        return result
      }
    })
    await ctx.runMutation(internal.games.patchPlayerGameInfo, {
      playerGameInfoId: playerGameInfo._id,
      updates: {
        testState: {
          type: "complete",
          results: resultsAfterChecking,
        },
      },
    })
  },
})

export const resetStartingCode = mutation({
  args: {
    gameId: v.id("game"),
  },
  handler: async (ctx, args) => {
    const { userId } = await requireUser(ctx)

    const [game, playerGameInfo] = await Promise.all([
      ctx.db.get(args.gameId),
      ctx.db
        .query("playerGameInfo")
        .withIndex("by_gameId_userId")
        .filter((q) => q.and(q.eq(q.field("userId"), userId), q.eq(q.field("gameId"), args.gameId)))
        .first(),
    ])

    if (!game || !playerGameInfo) {
      throw new ConvexError("Game or player not found")
    }

    if (playerGameInfo.code === game.question.starting_code) {
      return
    }

    await ctx.db.patch(playerGameInfo._id, {
      code: game.question.starting_code,
      chatHistory: [...playerGameInfo.chatHistory, { role: "reset" }],
    })
  },
})

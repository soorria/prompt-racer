import { invariant } from "@epic-web/invariant"
import { TRPCError } from "@trpc/server"
import { dequal } from "dequal"
import { count } from "drizzle-orm"
import { z } from "zod"

import { runPythonCodeAgainstTestCases } from "~/lib/code-execution/python"
import { cmp, schema } from "~/lib/db"
import { type DBOrTransation, type DocInsert } from "~/lib/db/types"
import { CODE_SUBMISSION_TIMEOUT, DEFAULT_GAME_DURATIONS } from "~/lib/games/constants"
import {
  getGameById,
  getGamesWithStatus,
  getInGameState,
  getLatestActiveGameForUser,
  getQuestionById,
  getRandomQuestion,
  getSessionInfoForPlayer,
} from "~/lib/games/queries"
import { getQuestionTestCasesOrderBy, getRandomGameMode } from "~/lib/games/utils"
import { inngest } from "~/lib/inngest/client"
import { logger } from "~/lib/server/logger"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/lib/trpc/trpc"
import { randomElement } from "~/lib/utils/random"
import { getPlayerPostionsForGameMode } from "./game-modes"

export const gameRouter = createTRPCRouter({
  getPlayerGameSession: protectedProcedure
    .input(
      z.object({
        game_id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const sessionInfo = await getSessionInfoForPlayer(ctx.db, ctx.user.id, input.game_id)
      if (!sessionInfo) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Game not found" })
      }
      return sessionInfo
    }),

  getGameStateWithQuestion: protectedProcedure
    .input(
      z.object({
        game_id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const gameState = await getInGameState(ctx.db, input.game_id)
      if (!gameState) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Game not found" })
      }
      return gameState
    }),

  submitCode: protectedProcedure
    .input(
      z.object({
        game_id: z.string(),
        submission_type: z.enum(["test-run", "submission"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const playerGameSession = await ctx.db.query.playerGameSessions.findFirst({
        where: cmp.and(
          cmp.eq(schema.playerGameSessions.user_id, ctx.user.id),
          cmp.eq(schema.playerGameSessions.game_id, input.game_id),
        ),
        with: {
          game: {
            with: {
              question: {
                with: {
                  testCases: {
                    where:
                      input.submission_type === "test-run"
                        ? cmp.eq(schema.questionTestCases.type, "public")
                        : undefined,
                    orderBy: getQuestionTestCasesOrderBy(),
                  },
                },
              },
            },
          },
          testState: input.submission_type === "test-run" ? true : undefined,
          submissionState: input.submission_type === "submission" ? true : undefined,
        },
      })

      if (!playerGameSession) {
        throw new TRPCError({
          message: "Game not found, or you are not in this game",
          code: "NOT_FOUND",
        })
      }

      if (playerGameSession.game.status !== "inProgress") {
        throw new TRPCError({
          message: "Game is not in progress",
          code: "BAD_REQUEST",
        })
      }

      const submissionState =
        input.submission_type === "submission"
          ? playerGameSession.submissionState
          : playerGameSession.testState

      if (submissionState) {
        const lastSubmittedAt = submissionState.last_submitted_at
        const now = Date.now()
        const msSinceLastSubmitted = now - lastSubmittedAt.getTime()
        if (msSinceLastSubmitted < CODE_SUBMISSION_TIMEOUT) {
          throw new TRPCError({
            message: `Need to wait ${CODE_SUBMISSION_TIMEOUT - msSinceLastSubmitted}ms before submitting again`,
            code: "BAD_REQUEST",
          })
        }
      }

      // TODO: transaction?
      const [[insertedSubmissionState]] = await Promise.all([
        ctx.db
          .insert(schema.playerGameSubmissionStates)
          .values({
            id: submissionState?.id,
            last_submitted_at: new Date(),
            player_game_session_id: playerGameSession.id,
            status: "running",
            submittion_type: input.submission_type,
          })
          .onConflictDoUpdate({
            target: schema.playerGameSubmissionStates.id,
            set: {
              status: "running",
              last_submitted_at: new Date(),
            },
          })
          .returning({
            id: schema.playerGameSubmissionStates.id,
          }),
        submissionState &&
          ctx.db
            .delete(schema.playerGameSubmissionStateResults)
            .where(
              cmp.eq(
                schema.playerGameSubmissionStateResults.player_game_submission_state_id,
                submissionState.id,
              ),
            ),
      ])

      if (!insertedSubmissionState) {
        throw new TRPCError({
          message: "Failed to insert submission state",
          code: "INTERNAL_SERVER_ERROR",
        })
      }

      const submissionStateIdField =
        input.submission_type === "submission" ? "submission_state_id" : "test_state_id"

      await ctx.db
        .update(schema.playerGameSessions)
        .set({
          [submissionStateIdField]: insertedSubmissionState.id,
        })
        .where(cmp.eq(schema.playerGameSessions.id, playerGameSession.id))

      const testCases = playerGameSession.game.question.testCases
      const runResults = await runPythonCodeAgainstTestCases(
        playerGameSession.code,
        testCases.map((testCase) => testCase.args),
      )

      const submissionResultDocs: DocInsert<"playerGameSubmissionStateResults">[] = testCases.map(
        (testCase, index) => {
          const result = runResults[index]

          const commonParts = {
            player_game_submission_state_id: insertedSubmissionState.id,
            question_test_case_id: testCase.id,
          }

          if (!result) {
            return {
              ...commonParts,
              status: "error",
              reason: "Failed to run code",
              is_correct: false,
              run_duration_ms: 0,
            }
          }

          return {
            ...commonParts,
            status: result.status === "success" ? "success" : "error",
            result: result.status === "success" ? result.result : null,
            reason: result.status === "error" ? result.reason.message : null,
            is_correct:
              result.status === "success" && dequal(testCase.expectedOutput, result.result),
            run_duration_ms: Math.max(Math.round(result.time), 1),
          }
        },
      )

      // TODO: transaction?
      await Promise.all([
        ctx.db.insert(schema.playerGameSubmissionStateResults).values(submissionResultDocs),
        ctx.db
          .update(schema.playerGameSubmissionStates)
          .set({
            status: "complete",
          })
          .where(cmp.eq(schema.playerGameSubmissionStates.id, insertedSubmissionState.id)),
        triggerPlayerGameSessionUpdate(ctx.db, playerGameSession.id),
      ])
    }),

  join: protectedProcedure.mutation(async ({ ctx }) => {
    const currentGame = await getLatestActiveGameForUser(ctx.db, ctx.user.id)

    if (currentGame) {
      throw new Error("You are already in a game")
    }

    const { game, question } = await getOrCreateGameToJoin(ctx.db)

    await ctx.db.insert(schema.playerGameSessions).values({
      user_id: ctx.user.id,
      game_id: game.id,
      code: question.starterCode,
      model: "openai::gpt-4o-mini",
    })

    return {
      game_id: game.id,
    }
  }),

  leave: protectedProcedure
    .input(
      z.object({
        game_id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const game = await getGameById(ctx.db, input.game_id)

      if (!game) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Game not found" })
      }

      if (game.status !== "waitingForPlayers") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot leave game" })
      }

      const deletedGameSessions = await ctx.db
        .delete(schema.playerGameSessions)
        .where(
          cmp.and(
            cmp.eq(schema.playerGameSessions.user_id, ctx.user.id),
            cmp.eq(schema.playerGameSessions.game_id, game.id),
          ),
        )
        .returning()

      if (deletedGameSessions.length === 0) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to leave game" })
      }

      if (deletedGameSessions.length > 1) {
        logger.error("Deleted more than one game session when leaving game", {
          user_id: ctx.user.id,
          game_id: game.id,
        })
      }

      const [remainingPlayersCount] = await ctx.db
        .select({
          count: count(),
        })
        .from(schema.playerGameSessions)
        .where(cmp.eq(schema.playerGameSessions.game_id, game.id))

      if (!remainingPlayersCount?.count) {
        // TODO: maybe cancel instead? also could add cancel reason
        await ctx.db.delete(schema.gameStates).where(cmp.eq(schema.gameStates.id, game.id))
      }
    }),

  resetStartingCode: protectedProcedure
    .input(
      z.object({
        game_id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const playerGameSession = await ctx.db.query.playerGameSessions.findFirst({
        where: cmp.and(
          cmp.eq(schema.playerGameSessions.user_id, ctx.user.id),
          cmp.eq(schema.playerGameSessions.game_id, input.game_id),
        ),
        with: {
          game: {
            with: {
              question: {
                columns: {
                  starterCode: true,
                },
              },
            },
          },
        },
      })

      if (!playerGameSession) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Game not found, or you are not in this game",
        })
      }

      const game = playerGameSession.game

      if (game.status !== "inProgress") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Game is not in progress" })
      }

      await ctx.db
        .update(schema.playerGameSessions)
        .set({
          code: game.question.starterCode,
        })
        .where(cmp.eq(schema.playerGameSessions.id, playerGameSession.id))
    }),
})

async function triggerPlayerGameSessionUpdate(tx: DBOrTransation, playerGameSessionId: string) {
  return await tx
    .update(schema.playerGameSessions)
    .set({ updated_at: new Date() })
    .where(cmp.eq(schema.playerGameSessions.id, playerGameSessionId))
}

async function getOrCreateGameToJoin(tx: DBOrTransation) {
  const waitingForPlayersGames = await getGamesWithStatus(tx, "waitingForPlayers")

  const existingGameToJoin = randomElement(waitingForPlayersGames)

  if (existingGameToJoin) {
    const question = await getQuestionById(tx, existingGameToJoin.question_id)
    invariant(question, "Game should not exist without a question")
    return {
      game: existingGameToJoin,
      question,
    }
  }

  return await createGame(tx)
}

async function createGame(tx: DBOrTransation) {
  const question = await getRandomQuestion(tx)
  const gameMode = getRandomGameMode()

  const [game] = await tx
    .insert(schema.gameStates)
    .values({
      question_id: question.id,
      mode: gameMode,
      status: "waitingForPlayers",
      in_progress_duration_ms: DEFAULT_GAME_DURATIONS.inProgress,
      waiting_for_players_duration_ms: DEFAULT_GAME_DURATIONS.waitingForPlayers,
    })
    .returning()

  if (!game) {
    throw new Error("Failed to create game")
  }

  await inngest.send({
    name: "game/started",
    data: {
      game_id: game.id,
      in_progress_duration_ms: DEFAULT_GAME_DURATIONS.inProgress,
      waiting_for_players_duration_ms: DEFAULT_GAME_DURATIONS.waitingForPlayers,
    },
  })

  return { game, question }
}

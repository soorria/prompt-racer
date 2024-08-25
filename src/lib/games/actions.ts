"use server"

import { invariant } from "@epic-web/invariant"
import { dequal } from "dequal"
import { count, desc } from "drizzle-orm"
import { z } from "zod"

import { authedAction } from "../actions/utils"
import { runPythonCodeAgainstTestCases } from "../code-execution/python"
import { cmp, db, schema } from "../db"
import { type DBOrTransation, type DocInsert } from "../db/types"
import { inngest } from "../inngest/client"
import { logger } from "../server/logger"
import { randomElement } from "../utils/random"
import { CODE_SUBMISSION_TIMEOUT, DEFAULT_GAME_DURATIONS } from "./constants"
import {
  getGameById,
  getGamesWithStatus,
  getLatestActiveGameForUser,
  getQuestionById,
  getRandomQuestion,
} from "./queries"
import { getQuestionTestCasesOrderBy, getRandomGameMode } from "./utils"

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
    logger.error("Failed to create game")
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

async function getOrCreateGameToJoin(tx: DBOrTransation) {
  const waitingForPlayersGames = await getGamesWithStatus(db, "waitingForPlayers")

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

export const joinGameAction = authedAction.action(async ({ ctx }) => {
  const currentGame = await getLatestActiveGameForUser(db, ctx.user.id)

  if (currentGame) {
    throw new Error("You are already in a game")
  }

  const { game, question } = await getOrCreateGameToJoin(db)

  await db.insert(schema.playerGameSessions).values({
    user_id: ctx.user.id,
    game_id: game.id,
    code: question.starterCode,
    model: "openai::gpt-4o-mini",
  })

  return {
    game_id: game.id,
  }
})

export const leaveGameAction = authedAction
  .schema(
    z.object({
      game_id: z.string(),
    }),
  )
  .action(async ({ ctx, parsedInput }) => {
    const game = await getGameById(db, parsedInput.game_id)

    if (!game) {
      throw new Error("Game not found")
    }

    if (game.status !== "waitingForPlayers") {
      throw new Error("Cannot leave game")
    }

    const deletedGameSessions = await db
      .delete(schema.playerGameSessions)
      .where(
        cmp.and(
          cmp.eq(schema.playerGameSessions.user_id, ctx.user.id),
          cmp.eq(schema.playerGameSessions.game_id, game.id),
        ),
      )
      .returning()

    if (deletedGameSessions.length === 0) {
      throw new Error("Failed to leave game")
    }

    if (deletedGameSessions.length > 1) {
      logger.error("Deleted more than one game session when leaving game", {
        user_id: ctx.user.id,
        game_id: game.id,
      })
    }

    const [remainingPlayersCount] = await db
      .select({
        count: count(),
      })
      .from(schema.playerGameSessions)
      .where(cmp.eq(schema.playerGameSessions.game_id, game.id))

    if (!remainingPlayersCount?.count) {
      // TODO: maybe cancel instead? also could add cancel reason
      await db.delete(schema.gameStates).where(cmp.eq(schema.gameStates.id, game.id))
    }
  })

export const getChatHistoryForGameAction = authedAction
  .schema(
    z.object({
      game_id: z.string(),
    }),
  )
  .action(async ({ ctx, parsedInput }) => {
    const playerGameSession = await db.query.playerGameSessions.findFirst({
      where: cmp.and(
        cmp.eq(schema.playerGameSessions.user_id, ctx.user.id),
        cmp.eq(schema.playerGameSessions.game_id, parsedInput.game_id),
      ),
    })

    if (!playerGameSession) {
      throw new Error("Game not found, or you are not in this game")
    }

    const chatHistoryItems = await db.query.playerGameSessionChatHistoryItems.findMany({
      where: cmp.eq(
        schema.playerGameSessionChatHistoryItems.player_game_session_id,
        playerGameSession.id,
      ),
      orderBy: desc(schema.playerGameSessionChatHistoryItems.inserted_at),
    })
    return chatHistoryItems
  })

export const submitCodeAction = authedAction
  .schema(
    z.object({
      game_id: z.string(),
      submission_type: z.enum(["test-run", "submission"]),
    }),
  )
  .action(async ({ ctx, parsedInput }) => {
    const playerGameSession = await db.query.playerGameSessions.findFirst({
      where: cmp.and(
        cmp.eq(schema.playerGameSessions.user_id, ctx.user.id),
        cmp.eq(schema.playerGameSessions.game_id, parsedInput.game_id),
      ),
      with: {
        game: {
          with: {
            question: {
              with: {
                testCases: {
                  where:
                    parsedInput.submission_type === "test-run"
                      ? cmp.eq(schema.questionTestCases.type, "public")
                      : undefined,
                  orderBy: getQuestionTestCasesOrderBy(),
                },
              },
            },
          },
        },
        testState: parsedInput.submission_type === "test-run" ? true : undefined,
        submissionState: parsedInput.submission_type === "submission" ? true : undefined,
      },
    })

    if (!playerGameSession) {
      throw new Error("Game not found, or you are not in this game")
    }

    if (playerGameSession.game.status !== "inProgress") {
      throw new Error("Game is not in progress")
    }

    const submissionState =
      parsedInput.submission_type === "submission"
        ? playerGameSession.submissionState
        : playerGameSession.testState

    if (submissionState) {
      const lastSubmittedAt = submissionState.last_submitted_at
      const now = Date.now()
      const msSinceLastSubmitted = now - lastSubmittedAt.getTime()
      if (msSinceLastSubmitted < CODE_SUBMISSION_TIMEOUT) {
        throw new Error(
          `Need to wait ${CODE_SUBMISSION_TIMEOUT - msSinceLastSubmitted}ms before submitting again`,
        )
      }
    }

    const [[insertedSubmissionState]] = await Promise.all([
      db
        .insert(schema.playerGameSubmissionStates)
        .values({
          id: submissionState?.id,
          last_submitted_at: new Date(),
          player_game_session_id: playerGameSession.id,
          status: "running",
          submittion_type: parsedInput.submission_type,
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
        db
          .delete(schema.playerGameSubmissionStateResults)
          .where(
            cmp.eq(
              schema.playerGameSubmissionStateResults.player_game_submission_state_id,
              submissionState.id,
            ),
          ),
    ])

    if (!insertedSubmissionState) {
      throw new Error("Failed to insert submission state")
    }

    const submissionStateIdField =
      parsedInput.submission_type === "submission" ? "submission_state_id" : "test_state_id"

    await db
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
          is_correct: result.status === "success" && dequal(testCase.expectedOutput, result.result),
          run_duration_ms: Math.max(Math.round(result.time), 1),
        }
      },
    )

    await Promise.all([
      db.insert(schema.playerGameSubmissionStateResults).values(submissionResultDocs),
      db
        .update(schema.playerGameSubmissionStates)
        .set({
          status: "complete",
        })
        .where(cmp.eq(schema.playerGameSubmissionStates.id, insertedSubmissionState.id)),
      triggerPlayerGameSessionUpdate(db, playerGameSession.id),
    ])
  })

async function triggerPlayerGameSessionUpdate(tx: DBOrTransation, playerGameSessionId: string) {
  return await tx
    .update(schema.playerGameSessions)
    .set({ updated_at: new Date() })
    .where(cmp.eq(schema.playerGameSessions.id, playerGameSessionId))
}

export const resetStartingCodeAction = authedAction
  .schema(
    z.object({
      game_id: z.string(),
    }),
  )
  .action(async ({ ctx, parsedInput }) => {
    const playerGameSession = await db.query.playerGameSessions.findFirst({
      where: cmp.and(
        cmp.eq(schema.playerGameSessions.user_id, ctx.user.id),
        cmp.eq(schema.playerGameSessions.game_id, parsedInput.game_id),
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
      throw new Error("Game not found, or you are not in this game")
    }

    const game = playerGameSession.game

    if (game.status !== "inProgress") {
      throw new Error("Game is not in progress")
    }

    await db
      .update(schema.playerGameSessions)
      .set({
        code: game.question.starterCode,
      })
      .where(cmp.eq(schema.playerGameSessions.id, playerGameSession.id))
  })

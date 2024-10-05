import "server-only"

import type { SQL } from "drizzle-orm"
import { invariant } from "@epic-web/invariant"
import { count } from "drizzle-orm"

import { requireAuthUser } from "../auth/user"
import { cmp, orderBy, schema } from "../db"
import { type DBOrTransation, type Doc } from "../db/types"
import { type QuestionDifficultyLevels } from "./constants"
import {
  type InGameState,
  type NotWaitingForPlayersGameState,
  type WaitingForPlayersGameState,
} from "./types"
import { getQuestionTestCasesOrderBy } from "./utils"

export async function getUserGameHistory(
  tx: DBOrTransation,
  {
    userId,
    limit = 10,
    cursor,
  }: {
    userId: string
    limit?: number
    cursor?: string
  },
) {
  const userFilter = cmp.eq(schema.playerGameSessions.user_id, userId)

  let filter: SQL | undefined = userFilter

  if (cursor) {
    filter = cmp.and(userFilter, cmp.lt(schema.gameStates.inserted_at, new Date(cursor)))
  }

  const results = await tx
    .select({
      game: {
        id: schema.gameStates.id,
        status: schema.gameStates.status,
        mode: schema.gameStates.mode,
        inserted_at: schema.gameStates.inserted_at,
      },
      finalResult: {
        position: schema.playerGameSessionFinalResults.position,
        score: schema.playerGameSessionFinalResults.score,
      },
    })
    .from(schema.playerGameSessions)
    .where(filter)
    .innerJoin(schema.gameStates, cmp.eq(schema.playerGameSessions.game_id, schema.gameStates.id))
    .leftJoin(
      schema.playerGameSessionFinalResults,
      cmp.eq(
        schema.playerGameSessions.id,
        schema.playerGameSessionFinalResults.player_game_session_id,
      ),
    )
    .orderBy(orderBy.desc(schema.gameStates.inserted_at))
    .limit(limit)

  return {
    items: results.map((item) => {
      return {
        ...item.game,
        finalResult: item.finalResult,
      }
    }),
    nextCursor: results.at(-1)?.game.inserted_at.toISOString(),
  }
}

export async function getLatestActiveGameForUser(tx: DBOrTransation, userId: string) {
  const [result] = await tx
    .select({
      session: schema.playerGameSessions,
      game: schema.gameStates,
    })
    .from(schema.playerGameSessions)
    .innerJoin(schema.gameStates, cmp.eq(schema.playerGameSessions.game_id, schema.gameStates.id))
    .where(
      cmp.and(
        cmp.eq(schema.playerGameSessions.user_id, userId),
        cmp.notInArray(schema.gameStates.status, ["cancelled", "finished"]),
      ),
    )
    .orderBy(orderBy.desc(schema.gameStates.start_time))
    .limit(10)

  return result ?? null
}

export async function getLatestActiveGameForCurrentUser(tx: DBOrTransation) {
  const user = await requireAuthUser()
  return getLatestActiveGameForUser(tx, user.id)
}

export async function getGamesWithStatus<Status extends Doc<"gameStates">["status"]>(
  tx: DBOrTransation,
  status: Status,
) {
  const results = await tx.query.gameStates.findMany({
    where: cmp.eq(schema.gameStates.status, status),
    with: {
      question: {
        columns: {
          difficulty: true,
        },
      },
    },
  })

  return results
}

export async function getSubmissionMetrics(tx: DBOrTransation, submission_state_id: string) {
  const submissionStateResults = await tx.query.playerGameSubmissionStateResults.findMany({
    where: cmp.eq(
      schema.playerGameSubmissionStateResults.player_game_submission_state_id,
      submission_state_id,
    ),
  })
  return {
    numPassingSubmissionsTestCases: submissionStateResults.filter((result) => result.is_correct)
      .length,
    numTestCases: submissionStateResults.length,
  }
}

export async function getRandomQuestion(tx: DBOrTransation, difficulty?: QuestionDifficultyLevels) {
  const baseQuery = tx.select({ count: count() }).from(schema.questions)
  const queryWithDifficulty = difficulty
    ? baseQuery.where(cmp.eq(schema.questions.difficulty, difficulty))
    : baseQuery

  const [numQuestions] = await queryWithDifficulty

  invariant(numQuestions?.count, "No questions found")

  const randomIndex = Math.floor(Math.random() * numQuestions.count)

  const baseQuestionQuery = tx.select().from(schema.questions)
  const questionQueryWithDifficulty = difficulty
    ? baseQuestionQuery.where(cmp.eq(schema.questions.difficulty, difficulty))
    : baseQuestionQuery

  const [question] = await questionQueryWithDifficulty.offset(randomIndex)

  invariant(question, "No question found")

  return question
}

export async function getQuestionById(tx: DBOrTransation, questionId: string) {
  const question = await tx.query.questions.findFirst({
    where: cmp.eq(schema.questions.id, questionId),
  })

  return question
}

export async function getGameById(tx: DBOrTransation, gameId: string) {
  const game = await tx.query.gameStates.findFirst({
    where: cmp.eq(schema.gameStates.id, gameId),
  })

  return game
}

export async function getInGameState(
  tx: DBOrTransation,
  gameId: string,
): Promise<InGameState | undefined> {
  const gameState = await tx.query.gameStates.findFirst({
    where: cmp.eq(schema.gameStates.id, gameId),
    columns: {
      question_id: false,
    },
    with: {
      question: {
        with: {
          testCases: {
            where: cmp.eq(schema.questionTestCases.type, "public"),
            orderBy: getQuestionTestCasesOrderBy(),
          },
        },
      },
      players: {
        with: {
          user: true,
        },
        columns: {},
      },
    },
  })

  if (gameState?.status === "waitingForPlayers") {
    return {
      ...gameState,
      question: null,
    } as WaitingForPlayersGameState
  }

  return gameState as NotWaitingForPlayersGameState | undefined
}

/**
 * Separated out to allow for caching
 */
export async function getGameResultsData(tx: DBOrTransation, gameId: string) {
  const game = await getGameById(tx, gameId)

  if (!game) {
    return null
  }

  const playerGameSessions = await tx.query.playerGameSessions.findMany({
    where: cmp.eq(schema.playerGameSessions.game_id, gameId),
    with: {
      finalResult: true,
      user: true,
    },
  })

  return {
    players: playerGameSessions,
    game: game,
  }
}

export async function getSessionInfoForPlayer(tx: DBOrTransation, userId: string, gameId: string) {
  return await tx.query.playerGameSessions.findFirst({
    where: cmp.and(
      cmp.eq(schema.playerGameSessions.user_id, userId),
      cmp.eq(schema.playerGameSessions.game_id, gameId),
    ),
    with: {
      submissionState: {
        with: {
          results: {
            columns: {
              is_correct: true,
            },
          },
        },
      },
      testState: {
        with: {
          results: true,
        },
      },
      chatHistory: {
        orderBy: orderBy.asc(schema.playerGameSessionChatHistoryItems.inserted_at),
      },
      finalResult: true,
    },
  })
}

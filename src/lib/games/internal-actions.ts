import "server-only"

import { addSeconds } from "date-fns"

import { requireAuthUser } from "../auth/user"
import { cmp, db, schema, sql } from "../db"
import { type Doc } from "../db/types"
import { streamUpdatedCode } from "../llm/generation"
import { extractCodeFromRawCompletion } from "../llm/utils"
import { LLM_PROMPTING_TIMEOUT } from "./constants"
import { getPlayerPostionsForGameMode } from "./game-modes"
import { getGameById } from "./queries"
import { chatHistoryItemTypeIs } from "./utils"

export async function advanceGameToStatus(
  gameId: string,
  status: Exclude<Doc<"gameStates">["status"], "waitingForPlayers" | "cancelled" | "finished">,
) {
  const game = await db.query.gameStates.findFirst({
    where: cmp.eq(schema.gameStates.id, gameId),
  })

  if (!game) {
    return
  }

  if (game.status === status) {
    return
  }

  await db
    .update(schema.gameStates)
    .set({
      status,
    })
    .where(cmp.eq(schema.gameStates.id, gameId))
}

export async function finalizeGame(gameId: string) {
  const [game, playerGameSessions] = await Promise.all([
    getGameById(db, gameId),
    db.query.playerGameSessions.findMany({
      where: cmp.eq(schema.playerGameSessions.game_id, gameId),
      with: {
        chatHistory: true,
        submissionState: {
          with: {
            results: true,
          },
        },
      },
    }),
  ])

  if (!game) {
    return
  }

  const positionResults = getPlayerPostionsForGameMode(game, playerGameSessions)

  await db.insert(schema.playerGameSessionFinalResults).values(positionResults)

  const winningResult = positionResults.find((r) => r.position === 0)
  if (winningResult) {
    const winningPlayerSession = playerGameSessions.find(
      (s) => s.id === winningResult.player_game_session_id,
    )

    if (winningPlayerSession) {
      await db
        .update(schema.users)
        .set({ wins: sql`${schema.users.wins} + 1` })
        .where(cmp.eq(schema.users.id, winningPlayerSession.user_id))
    }
  }

  await db
    .update(schema.gameStates)
    .set({
      status: "finished",
    })
    .where(cmp.eq(schema.gameStates.id, game.id))
}

export async function sendMessageInGame(gameId: string, instructions: string) {
  const user = await requireAuthUser()
  const playerGameSession = await db.query.playerGameSessions.findFirst({
    where: cmp.and(
      cmp.eq(schema.playerGameSessions.user_id, user.id),
      cmp.eq(schema.playerGameSessions.game_id, gameId),
    ),
    with: {
      game: true,
    },
  })

  if (!playerGameSession) {
    throw new Error("Game not found, or you are not in this game")
  }

  const { game } = playerGameSession

  if (game.status !== "inProgress") {
    throw new Error("Game is not in progress")
  }

  const lastPromptedAt = playerGameSession.last_prompted_at
  if (lastPromptedAt) {
    const lastPromptedAtMs = lastPromptedAt.getTime()
    const now = Date.now()
    const msSinceLastPrompt = now - lastPromptedAtMs
    if (msSinceLastPrompt < LLM_PROMPTING_TIMEOUT) {
      throw new Error(
        `Need to wait ${LLM_PROMPTING_TIMEOUT - msSinceLastPrompt}ms before prompting again`,
      )
    }
  }

  const insertedItems = await db
    .insert(schema.playerGameSessionChatHistoryItems)
    .values([
      {
        player_game_session_id: playerGameSession.id,
        content: {
          type: "instructions",
          instructions,
        },
        inserted_at: new Date(),
      },
      {
        player_game_session_id: playerGameSession.id,
        content: {
          type: "ai",
          rawCompletion: "",
          parsedCompletion: {
            state: "generating",
            maybeCode: "",
          },
        },
        // TODO: figure out a better solution lol
        inserted_at: addSeconds(new Date(), 1),
      },
    ])
    .returning()

  const insertedAtMessage = insertedItems.find((item) => chatHistoryItemTypeIs(item, "ai"))

  if (!insertedAtMessage) {
    throw new Error("Failed to insert message")
  }

  await db
    .update(schema.playerGameSessions)
    .set({
      last_prompted_at: new Date(),
    })
    .where(cmp.eq(schema.playerGameSessions.id, playerGameSession.id))

  const result = await streamUpdatedCode({
    existingCode: playerGameSession.code,
    instructions,
    modelId: playerGameSession.model,
    onFinish: async (completion) => {
      const rawUpdatedCode = completion.text
      const extractedCode = extractCodeFromRawCompletion(rawUpdatedCode)

      await Promise.all([
        db
          .update(schema.playerGameSessionChatHistoryItems)
          .set({
            player_game_session_id: playerGameSession.id,
            content: extractedCode
              ? {
                type: "ai",
                rawCompletion: rawUpdatedCode,
                parsedCompletion: {
                  state: "success",
                  maybeCode: extractedCode,
                },
              }
              : {
                type: "ai",
                rawCompletion: rawUpdatedCode,
                parsedCompletion: {
                  state: "error",
                  error: "Could not find code in AI completion",
                },
              },
          })
          .where(cmp.eq(schema.playerGameSessionChatHistoryItems.id, insertedAtMessage.id)),
        extractedCode &&
        db
          .update(schema.playerGameSessions)
          .set({ code: extractedCode })
          .where(cmp.eq(schema.playerGameSessions.id, playerGameSession.id)),
      ])
    },
  })

  return result
}

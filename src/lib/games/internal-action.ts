import "server-only"

import { cmp, db, schema, sql } from "../db"
import { type Doc } from "../db/types"
import { getPlayerPostionsForGameMode } from "./game-modes"
import { getGameById } from "./queries"

export async function advanceGameToStatus(
  gameId: string,
  status: Exclude<Doc<"gameStates">["status"], "waitingForPlayers" | "cancelled" | "finished">,
) {
  const game = await db.query.gameStates.findFirst({
    where: cmp.eq(schema.gameStates, gameId),
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
    .where(cmp.eq(schema.gameStates, gameId))
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
        .where(cmp.eq(schema.users, winningPlayerSession.user_id))
    }
  }

  await db
    .update(schema.gameStates)
    .set({
      status: "finished",
    })
    .where(cmp.eq(schema.gameStates, game.id))
}

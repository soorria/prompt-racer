import React, { Suspense } from "react"
import { notFound } from "next/navigation"

import type { Nullable } from "~/lib/utils/types"
import LeaderboardHighlight from "~/components/leaderboard-screen/LeaderboardHighlight"
import { LazyLeaderboardWinnerConfetti } from "~/components/leaderboard-screen/LeaderboardWinnerConfetti.lazy"
import { ResultsTable } from "~/components/results/ResultsTable"
import { cmp, db, schema } from "~/lib/db"
import { type GameMode } from "~/lib/games/constants"
import { getWorseScoreForGameMode } from "~/lib/games/game-modes"
import { getGameById } from "~/lib/games/queries"
import { type FinalPlayerResult } from "~/lib/games/types"

function resolveFinalResult(
  finalResult: Nullable<FinalPlayerResult>,
  gameMode: GameMode,
): FinalPlayerResult {
  if (finalResult) {
    return finalResult
  }

  return {
    position: Number.MAX_SAFE_INTEGER,
    score: getWorseScoreForGameMode(gameMode),
  }
}

/**
 * Separated out to allow for caching
 */
async function getGameResultsData(gameId: string) {
  const game = await getGameById(db, gameId)

  if (!game) {
    return null
  }

  const playerGameSessions = await db.query.playerGameSessions.findMany({
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

async function getResults(gameId: string) {
  const data = await getGameResultsData(gameId)

  if (!data) {
    notFound()
  }

  const { players, game } = data

  return {
    players: [...players]
      .map((session) => ({
        ...session,
        finalResult: resolveFinalResult(session.finalResult, game.mode),
      }))
      .sort((a, b) => a.finalResult.position - b.finalResult.position),
    game,
  }
}

export const revalidate = 3600

export default async function ResultsPage({ params }: { params: { gameId: string } }) {
  const { players } = await getResults(params.gameId)

  return (
    <div>
      <h1 className="mx-auto my-6 max-w-4xl text-center text-4xl font-bold tracking-tight text-white sm:my-14 sm:text-5xl">
        Results
      </h1>

      <Suspense>
        <LazyLeaderboardWinnerConfetti once />
      </Suspense>
      <LeaderboardHighlight
        podiumNoPlayerPlaceholder="Vacant"
        players={players.slice(0, 3).map((u) => ({
          ...u.user,
          winCondition: { label: "Score", value: `${u.finalResult?.score}` },
        }))}
      />
      <ResultsTable users={players.map((u) => u.user)} />
    </div>
  )
}

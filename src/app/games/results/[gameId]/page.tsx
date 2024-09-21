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

async function getResults(gameId: string) {
  const game = await getGameById(db, gameId)
  if (!game) {
    notFound()
  }

  const playerGameSessions = await db.query.playerGameSessions.findMany({
    where: cmp.eq(schema.playerGameSessions.game_id, gameId),
    with: {
      finalResult: true,
      user: true,
    },
  })

  return {
    players: [...playerGameSessions]
      .map((session) => ({
        ...session,
        finalResult: resolveFinalResult(session.finalResult, game.mode),
      }))
      .sort(
        (a, b) =>
          (a.finalResult?.position ?? Number.MAX_SAFE_INTEGER) -
          (b.finalResult?.position ?? Number.MAX_SAFE_INTEGER),
      ),
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
        players={players.slice(0, 3).map((u) => ({
          ...u.user,
          winCondition: { label: "Score", value: `${u.finalResult?.score}` },
        }))}
      />
      <ResultsTable users={players.map((u) => u.user)} />
    </div>
  )
}

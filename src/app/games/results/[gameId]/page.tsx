import React, { Suspense } from "react"
import { notFound } from "next/navigation"

import type { GameMode } from "~/lib/games/constants"
import type { Nullable } from "~/lib/utils/types"
import LeaderboardHighlight from "~/components/leaderboard-screen/LeaderboardHighlight"
import { LazyLeaderboardWinnerConfetti } from "~/components/leaderboard-screen/LeaderboardWinnerConfetti.lazy"
import { ResultsTable } from "~/components/results/ResultsTable"
import { db } from "~/lib/db"
import { GAME_MODE_DETAILS } from "~/lib/games/constants"
import { getWorseScoreForGameMode } from "~/lib/games/game-modes"
import { getGameResultsData } from "~/lib/games/queries"
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
  const data = await getGameResultsData(db, gameId)

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

type GameResults = Awaited<ReturnType<typeof getResults>>
export type GameResultsPlayer = GameResults["players"][number]

export const revalidate = 3600

export default async function ResultsPage({ params }: { params: { gameId: string } }) {
  const { players, game } = await getResults(params.gameId)

  const { unitLong } = GAME_MODE_DETAILS[game.mode]

  return (
    <div className="mx-auto max-w-screen-lg">
      <h1 className="mx-auto my-6 max-w-4xl text-center text-4xl font-bold tracking-tight text-white sm:my-14 sm:text-5xl">
        Results
      </h1>

      <Suspense>
        <LazyLeaderboardWinnerConfetti once />
      </Suspense>

      <LeaderboardHighlight
        podiumNoPlayerPlaceholder="Vacant"
        players={players
          .slice(0, 3)
          .filter((u) => u.submission_state_id !== null)
          .map((u) => ({
            ...u.user,
            winCondition: { label: "Score", value: `${u.finalResult?.score} ${unitLong}` },
          }))}
      />
      <ResultsTable users={players} gameMode={game.mode} />
    </div>
  )
}

import React, { Suspense } from "react"
import { notFound } from "next/navigation"

import type { GameMode } from "~/lib/games/constants"
import type { FinalPlayerResult } from "~/lib/games/types"
import type { Nullable } from "~/lib/utils/types"
import LeaderboardHighlight from "~/components/leaderboard-screen/LeaderboardHighlight"
import { LazyLeaderboardWinnerConfetti } from "~/components/leaderboard-screen/LeaderboardWinnerConfetti.lazy"
import QuestionDifficultyBadge from "~/components/QuestionDifficultyBadge"
import { ResultsTable } from "~/components/results/ResultsTable"
import { db } from "~/lib/db"
import { GAME_MODE_DETAILS } from "~/lib/games/constants"
import { getWorseScoreForGameMode } from "~/lib/games/game-modes"
import { getGameResultsData } from "~/lib/games/queries"

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

  if (!data || data.game.status !== "finished") {
    notFound()
  }

  const { players, game, question } = data

  return {
    players: [...players]
      .map((session) => ({
        ...session,
        finalResult: resolveFinalResult(session.finalResult, game.mode),
      }))
      .sort((a, b) => a.finalResult.position - b.finalResult.position),
    game,
    difficulty: question?.difficulty,
  }
}

type GameResults = Awaited<ReturnType<typeof getResults>>
export type GameResultsPlayer = GameResults["players"][number]

export const revalidate = 3600

export default async function ResultsPage({ params }: { params: { gameId: string } }) {
  const { players, game, difficulty } = await getResults(params.gameId)
  const { unitLong, description, toDisplayValue } = GAME_MODE_DETAILS[game.mode]

  return (
    <div className="mx-auto max-w-screen-lg">
      <div className="my-6 grid place-content-center justify-items-center gap-2 sm:my-14">
        <h1 className="mx-auto max-w-4xl text-center text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Results
        </h1>
        <h2 className="px-3 py-1 text-center text-sm font-medium opacity-65 sm:text-lg">
          {description}
        </h2>
        {difficulty && <QuestionDifficultyBadge difficulty={difficulty} className="text-sm" />}
      </div>

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
            winCondition: {
              label: "Score",
              value: `${toDisplayValue(u.finalResult?.score)} ${unitLong}`,
            },
          }))}
      />
      <ResultsTable users={players} gameMode={game.mode} />
    </div>
  )
}

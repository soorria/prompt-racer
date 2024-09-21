import React, { Suspense } from "react"

import LeaderboardHighlight from "~/components/leaderboard-screen/LeaderboardHighlight"
import { LazyLeaderboardWinnerConfetti } from "~/components/leaderboard-screen/LeaderboardWinnerConfetti.lazy"
import { ResultsTable } from "~/components/results/ResultsTable"
import { api } from "~/lib/trpc/server"

export default async function ResultsPage({ params }: { params: { gameId: string } }) {
  const users = await api.games.getPlayerPositions({ game_id: params.gameId })
  console.log(users)

  return (
    <div>
      <h1 className="mx-auto my-6 max-w-4xl text-center text-4xl font-bold tracking-tight text-white sm:my-14 sm:text-5xl">
        Results
      </h1>

      <Suspense>
        <LazyLeaderboardWinnerConfetti tiggerOnce={true} />
      </Suspense>
      <LeaderboardHighlight
        players={users
          .slice(0, 3)
          .map((u) => ({ ...u.user, winCondition: { label: "Score", value: `${u.score}` } }))}
      />
      <ResultsTable users={users.map((u) => u.user)} />
    </div>
  )
}

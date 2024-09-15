"use client"

import dynamic from "next/dynamic"

export const LazyLeaderboardWinnerConfetti = dynamic(
  () =>
    import("~/components/leaderboard-screen/LeaderboardWinnerConfetti").then(
      (mod) => mod.LeaderboardWinnerConfetti,
    ),
  {
    ssr: false,
  },
)

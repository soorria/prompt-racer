import React from "react"
import Link from "next/link"

import type { GameMode } from "~/lib/games/constants"
import { GAME_MODES_WITH_TITLES } from "~/lib/games/constants"
import { cn } from "~/lib/utils"

const GAME_MODES_WITH_STYLES = {
  "fastest-code": "hideout",
  "fastest-player": "fallingTriangles",
  "shortest-code": "randomShapes",
  "fewest-characters-to-llm": "bubbles",
} as const satisfies Record<GameMode, string>

export default function GameCard({ gameMode }: { gameMode: GameMode }) {
  return (
    <Link
      href={`/games/play/test-game`}
      className={cn(
        "grid place-items-center rounded-xl bg-card fill-white p-9 text-center transition-all hover:scale-105",
        GAME_MODES_WITH_STYLES[gameMode],
      )}
    >
      <h1 className="text-2xl font-bold">{GAME_MODES_WITH_TITLES[gameMode]}</h1>
    </Link>
  )
}

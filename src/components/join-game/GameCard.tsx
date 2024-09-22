import React from "react"
import Link from "next/link"

import type { GameMode } from "~/lib/games/constants"
import { GAME_MODE_DETAILS } from "~/lib/games/constants"
import { cn } from "~/lib/utils"

const GAME_MODE_BACKGROUND_PATTERN = {
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
        GAME_MODE_BACKGROUND_PATTERN[gameMode],
      )}
    >
      <h1 className="text-2xl font-bold">{GAME_MODE_DETAILS[gameMode].title}</h1>
    </Link>
  )
}

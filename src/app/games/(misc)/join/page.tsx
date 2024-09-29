import React from "react"

import GameCard from "~/components/join-game/GameCard"
import RandomGameModeSelector from "~/components/join-game/RandomGameModeSelector"
import { GAME_MODES } from "~/lib/games/constants"

export default function JoinGame() {
  return (
    <>
      <div className="mx-auto my-8 max-w-2xl text-center lg:max-w-none">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Select a game mode!</h2>
        <p className="mt-4 text-lg leading-8 text-zinc-400">
          Each game mode has a different goal. Choose the one to flex your skills!
        </p>
      </div>
      <RandomGameModeSelector />

      <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {GAME_MODES.map((gm) => (
          <GameCard key={gm} gameMode={gm} />
        ))}
      </ul>
    </>
  )
}

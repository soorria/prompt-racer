"use client"

import { useAction, useQuery } from "convex/react"
import { Debug } from "~/components/Debug"
import { Button } from "~/components/ui/button"
import { api } from "~convex/api"

const GameDashboard = () => {
  const currentGame = useQuery(api.games.getLatestGameForAuthedUser)
  const joinGame = useAction(api.games.joinGame)

  const handleJoinGame = () => {
    if (currentGame) {
      console.log(currentGame)
    } else {
      joinGame()
    }
  }

  return (
    <div>
      <Button onClick={handleJoinGame}>
        {currentGame?.state === "in-progress" || currentGame?.state === "waiting-for-players"
          ? "Continue game"
          : "Join a game"}
      </Button>

      <Debug currentGame={currentGame} />
    </div>
  )
}

export default GameDashboard

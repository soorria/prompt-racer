"use client"

import { useAction, useConvexAuth, useMutation, useQuery } from "convex/react"
import { Debug } from "~/components/Debug"
import { Button } from "~/components/ui/button"
import { useConvexUser } from "~/lib/convex"
import { api } from "~convex/api"
import invariant from "tiny-invariant"

const GameDashboard = () => {
  const currentUser = useConvexUser()
  const activeGame = useQuery(api.games.getLatestActiveGameForAuthedUser)
  const joinGame = useAction(api.games.joinGame)
  const cancelGame = useMutation(api.games.cancelGame)
  // const leaveGame = useMutation(api.games.leaveGame)

  const handleJoinGame = () => {
    if (activeGame) {
      console.log(activeGame)
    } else {
      joinGame()
    }
  }

  const handleCancelGame = () => {
    invariant(activeGame, "activeGame should exist")
    invariant(currentUser, "currentUser should exist")
    cancelGame({ gameId: activeGame._id })
  }

  const handleLeaveGame = () => {
    invariant(activeGame, "activeGame should exist")
    invariant(currentUser, "currentUser should exist")
    // leaveGame({ gameId: currentGame._id })
  }

  return (
    <div>
      <div className="flex gap-6">
        <Button onClick={handleJoinGame}>
          {activeGame?.state === "in-progress" || activeGame?.state === "waiting-for-players"
            ? "Continue game"
            : "Join a game"}
        </Button>

        {activeGame ? (
          <>
            {activeGame.creatorId === currentUser?.userId ? (
              <Button
                variant={"destructive"}
                onClick={handleCancelGame}
                disabled={activeGame.state === "in-progress"}
              >
                Cancel game{activeGame.state === "in-progress" ? " (game in progress)" : ""}
              </Button>
            ) : (
              <Button variant={"destructive"} onClick={handleLeaveGame}>
                Leave game
              </Button>
            )}
          </>
        ) : null}
      </div>

      <div className="mt-8">
        <Debug activeGame={activeGame} $title="Game user is currently in" />
      </div>
    </div>
  )
}

export default GameDashboard

"use client"

import { useAction, useConvexAuth, useMutation, useQuery } from "convex/react"
import { Debug } from "~/components/Debug"
import { Button } from "~/components/ui/button"
import { useConvexUser } from "~/lib/convex"
import { api } from "~convex/api"

const GameDashboard = () => {
  const currentUser = useConvexUser()
  const currentGame = useQuery(api.games.getLatestGameForAuthedUser)
  const joinGame = useAction(api.games.joinGame)
  const cancelGame = useMutation(api.games.cancelGame)

  const handleJoinGame = () => {
    if (currentGame) {
      console.log(currentGame)
    } else {
      joinGame()
    }
  }

  const handleCancelOrLeaveGame = () => {
    console.log("cancel or leave game")
    if (currentGame && currentUser && currentGame.creatorId === currentUser.userId) {
      cancelGame({ gameId: currentGame._id })
    } else {
      console.log("leave game")
    }
  }

  return (
    <div>
      <div className="flex gap-6">
        <Button onClick={handleJoinGame}>
          {currentGame?.state === "in-progress" || currentGame?.state === "waiting-for-players"
            ? "Continue game"
            : "Join a game"}
        </Button>

        {currentGame ? (
          <>
            <Button variant={"destructive"} onClick={handleCancelOrLeaveGame}>
              {currentGame.creatorId === currentUser?.userId ? "Cancel game" : "Leave game"}
            </Button>
          </>
        ) : null}
      </div>

      <Debug currentGame={currentGame} />
    </div>
  )
}

export default GameDashboard

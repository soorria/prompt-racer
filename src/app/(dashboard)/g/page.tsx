"use client"

import { useAction, useConvexAuth, useMutation, useQuery } from "convex/react"
import { Debug } from "~/components/Debug"
import { Button } from "~/components/ui/button"
import { useConvexUser } from "~/lib/convex"
import { api } from "~convex/api"
import invariant from "tiny-invariant"
import LobbyPlayerCard from "~/components/LobbyPlayerCard"
import PanelSkeleton from "~/components/PanelSkeleton"

const Spinner = () => {
  return (
    <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
  )
}

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
  const isLoading = !activeGame // Example condition, you can modify this based on your game logic

  return (
    <div className="h-full">
      <div className="flex gap-6">
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
      {activeGame && activeGame.state === "in-progress" && <PanelSkeleton />}

      {activeGame?.state === "waiting-for-players" && (
        <div className="flex flex-col items-center mt-8">
          <LobbyPlayerCard players={[currentUser]} />
          <p className="mt-4 text-gray-600 animate-pulse">Waiting for players...</p>
        </div>
      )}

      <div className="mt-8">
        <Debug activeGame={activeGame} $title="Game user is currently in" />
      </div>
    </div>
  )
}

export default GameDashboard

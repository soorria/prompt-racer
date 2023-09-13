import { useAction, useMutation, useQuery } from "convex/react"
import invariant from "tiny-invariant"
import { Debug } from "~/components/Debug"
import LobbyPlayerCard from "~/components/LobbyPlayerCard"
import PanelSkeleton from "~/components/PanelSkeleton"
import { Button } from "~/components/ui/button"
import { useConvexUser } from "~/lib/convex"
import { api } from "~convex/api"

const PlayGamePage = (props: { params: { gameId: string } }) => {
  const game = useQuery(api.games.getGame, { gameId: props.params.gameId })

  const joinGame = useAction(api.games.joinGame)
  const cancelGame = useMutation(api.games.cancelGame)
  const currentUser = useConvexUser()

  const handleCancelGame = () => {
    invariant(game, "activeGame should exist")
    invariant(currentUser, "currentUser should exist")
    cancelGame({ gameId: game._id })
  }

  const handleLeaveGame = () => {
    invariant(game, "activeGame should exist")
    invariant(currentUser, "currentUser should exist")
    // leaveGame({ gameId: currentGame._id })
  }
  return (
    <div className="h-full">
      <div className="flex gap-6">
        {game ? (
          <>
            {game.creatorId === currentUser?.userId ? (
              <Button
                variant={"destructive"}
                onClick={handleCancelGame}
                disabled={game.state === "in-progress"}
              >
                Cancel game{game.state === "in-progress" ? " (game in progress)" : ""}
              </Button>
            ) : (
              <Button variant={"destructive"} onClick={handleLeaveGame}>
                Leave game
              </Button>
            )}
          </>
        ) : null}
      </div>
      {game && game.state === "in-progress" && <PanelSkeleton />}

      {game?.state === "waiting-for-players" && (
        <div className="flex flex-col items-center mt-8">
          <LobbyPlayerCard players={[currentUser]} />
          <p className="mt-4 text-gray-600 animate-pulse">Waiting for players...</p>
        </div>
      )}

      <div className="mt-8">
        <Debug activeGame={game} $title="Game user is currently in" />
      </div>
    </div>
  )
}

export default PlayGamePage

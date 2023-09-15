"use client"
import { useAction, useMutation, useQuery } from "convex/react"
import invariant from "tiny-invariant"
import { Debug } from "~/components/Debug"
import LobbyPlayerCard from "~/components/LobbyPlayerCard"
import PanelSkeleton from "~/components/PanelSkeleton"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { useConvexUser } from "~/lib/convex"
import { api } from "~convex/api"

const fallbackGameInfo = {
  game: null,
  allPlayerGameInfos: null,
  currentPlayerInfo: null,
}
const PlayGamePage = (props: { params: { gameId: string } }) => {
  const gameInfo =
    useQuery(api.games.getGameInfoForUser, { gameId: props.params.gameId }) ?? fallbackGameInfo
  const { game, allPlayerGameInfos, currentPlayerInfo } = gameInfo

  const joinGame = useAction(api.games.joinGame)
  const sendMessage = useAction(api.games.sendMessageForPlayerInGame)
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
      {/* {game && game.state === "in-progress" && <PanelSkeleton />} */}

      {/* {game?.state === "waiting-for-players" && (
        <div className="flex flex-col items-center mt-8">
          <LobbyPlayerCard players={[currentUser]} />
          <p className="mt-4 text-gray-600 animate-pulse">Waiting for players...</p>
        </div>
      )} */}

      <div>
        {currentPlayerInfo?.chatHistory.map((item, index) => (
          <div key={index} className="whitespace-pre">
            <div>
              {item.role.toUpperCase()}: {item.content}
            </div>

            {item.role === "ai" && <div>{JSON.stringify(item.parsed)}</div>}
          </div>
        ))}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            const message = new FormData(e.currentTarget).get("message") as string

            sendMessage({
              gameId: game!._id,
              message,
            })
          }}
        >
          <Input type="text" name="message"></Input>
          <Button>Send</Button>
        </form>
      </div>

      <div className="mt-8">
        <Debug activeGame={game} $title="Game user is currently in" />d
      </div>
    </div>
  )
}

export default PlayGamePage

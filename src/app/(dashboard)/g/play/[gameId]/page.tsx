"use client"
import { useAction, useMutation, useQuery } from "convex/react"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import invariant from "tiny-invariant"
import ChatPanel from "~/components/ChatPanel"
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

  const sendMessage = useAction(api.games.sendMessageForPlayerInGame)

  const currentUser = useConvexUser()

  const [sending, setSending] = useState(false)

  return (
    <div className="h-full pt-4">
      {(game?.state === "in-progress" || game?.state === "finished") && (
        <>
          {game && currentPlayerInfo && (
            <PanelSkeleton
              game={game}
              question={game.question}
              chatPanelProps={{
                messages: currentPlayerInfo.chatHistory,
                onMessageSend: async (message) => {
                  try {
                    setSending(true)

                    await sendMessage({
                      gameId: game!._id,
                      message,
                    })
                  } finally {
                    setSending(false)
                  }
                },
                sending: sending,
              }}
              playerGameInfo={currentPlayerInfo}
            />
          )}
        </>
      )}

      {game?.state === "waiting-for-players" && (
        <div className="flex flex-col items-center mt-8">
          <LobbyPlayerCard players={[currentUser]} />
          <p className="mt-4 text-gray-600 animate-pulse">Waiting for players...</p>
        </div>
      )}
    </div>
  )
}

export default PlayGamePage

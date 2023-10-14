"use client"
import { useAction, useMutation, useQuery } from "convex/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import invariant from "tiny-invariant"
import ChatPanel from "~/components/ChatPanel"
import CountdownTimer from "~/components/CountdownTimer"
import { Debug } from "~/components/Debug"
import FinishGameScreen from "~/components/FinishGameScreen"
import IngameTimer from "~/components/IngameTimer"
import LobbyPlayerCard from "~/components/LobbyPlayerCard"
import PanelSkeleton from "~/components/PanelSkeleton"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { useConvexUser } from "~/lib/convex"
import { api } from "~convex/api"

const fallbackGameInfo = {
  game: undefined,
  allPlayerGameInfos: undefined,
  currentPlayerInfo: undefined,
}
const PlayGamePage = (props: { params: { gameId: string } }) => {
  const gameInfo =
    useQuery(api.games.getGameInfoForUser, { gameId: props.params.gameId }) ?? fallbackGameInfo
  const { game, allPlayerGameInfos, currentPlayerInfo } = gameInfo

  const router = useRouter()

  useEffect(() => {
    if (game === null) {
      router.replace("/g")
    }
  }, [game, router])

  const sendMessage = useAction(api.games.sendMessageForPlayerInGame)
  const [sending, setSending] = useState(false)

  const leaveGame = useMutation(api.games.leaveGame)

  return (
    <div className="h-full pt-4">
      {game?.state === "finished" && (
        <>
          <FinishGameScreen players={game.players} />
        </>
      )}
      {game?.state === "in-progress" && (
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

      {game?.state === "finalising" && (
        <div className="h-full grid place-items-center">Finalising game...</div>
      )}

      {game?.state === "waiting-for-players" && (
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center justify-center my-16">
            <h2 className="font-bold text-xl mb-8 text-zinc-400">Game Begins In</h2>
            <CountdownTimer endTime={game.gameStartTime} />
          </div>
          <LobbyPlayerCard
            players={game.players ?? []}
            onLeaveGame={() => {
              leaveGame({ gameId: game._id })
            }}
          />
          <p className="mt-4 text-gray-600 animate-pulse">Waiting for players...</p>
        </div>
      )}
    </div>
  )
}

export default PlayGamePage

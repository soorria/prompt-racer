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
import { useWrappedAction, useWrappedMutation, useWrappedQuery } from "~/lib/convex-utils"
import { api } from "~convex/api"
import { Id } from "~convex/dataModel"

const fallbackGameInfo = {
  game: undefined,
  allPlayerGameInfos: undefined,
  currentPlayerInfo: undefined,
}
const PlayGamePage = (props: { params: { gameId: string } }) => {
  const gameInfo = useWrappedQuery(api.games.getGameInfoForUser, { gameId: props.params.gameId })
  let { game, allPlayerGameInfos, currentPlayerInfo } = gameInfo.data ?? fallbackGameInfo

  // game ||= {
  //   _id: "a" as Id<"game">,
  //   _creationTime: 1,
  //   creatorId: "a",
  //   gameEndTime: 1,
  //   gameStartTime: 1,
  //   mode: "shortest-code",
  //   question: {
  //     description: "what is 1 + 1?",
  //     title: "math",
  //     examples: [],
  //     source: {
  //       type: "ai",
  //     } as any,
  //     starting_code: ``,
  //     test_cases: [],
  //     difficulty: "easy",
  //   },
  //   state: "in-progress",
  // }
  // currentPlayerInfo ||= {
  //   _id: "a" as Id<"playerGameInfo">,
  //   _creationTime: 1,
  //   chatHistory: [],
  //   code: "",
  //   gameId: game._id,
  //   userId: "",
  //   state: "playing",
  // }

  const router = useRouter()

  useEffect(() => {
    if (game === null) {
      router.replace("/g")
    }
  }, [game, router])

  const sendMessage = useWrappedAction(api.games.sendMessageForPlayerInGame)

  const leaveGame = useWrappedMutation(api.games.leaveGame)

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
                onMessageSend: (message) => {
                  sendMessage.mutate({
                    gameId: game!._id,
                    message,
                  })
                },
                sending: sendMessage.isLoading,
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
            onLeaveGame={() => leaveGame.mutate({ gameId: game!._id })}
          />
          <p className="mt-4 text-gray-600 animate-pulse">Waiting for players...</p>
        </div>
      )}
    </div>
  )
}

export default PlayGamePage

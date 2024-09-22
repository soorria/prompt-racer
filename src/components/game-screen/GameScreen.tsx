"use client"

import { notFound, redirect } from "next/navigation"

import { GameLayoutLoadingPage } from "~/app/games/play/[gameId]/loading"
import { ClientOnly } from "../ClientOnly"
import { useGameManager } from "./GameManagerProvider"
import { InProgressGame } from "./InProgressGame"
import { Lobby } from "./Lobby"

export function GameScreen() {
  const { gameInfo } = useGameManager()

  if (gameInfo.status === "waitingForPlayers") {
    return <Lobby />
  }

  if (gameInfo.status === "inProgress") {
    return (
      <ClientOnly fallback={<GameLayoutLoadingPage />}>
        <InProgressGame gameInfo={gameInfo} />
      </ClientOnly>
    )
  }

  if (gameInfo.status === "finalising") {
    return <div>Finalising...</div>
  }

  if (gameInfo.status === "cancelled") {
    notFound()
  }

  if (gameInfo.status === "finished") {
    redirect(`/games/results/${gameInfo.id}`)
  }
}

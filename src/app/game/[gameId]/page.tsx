import React from "react"
import { notFound } from "next/navigation"

import GameLayout from "~/components/game-screen/GameLayout"
import { requireAuthUser } from "~/lib/auth/user"
import { db } from "~/lib/db"
import { getQuestionForGame, getSessionInfoForPlayer } from "~/lib/games/queries"

export default async function GamePage({ params: { gameId } }: { params: { gameId: string } }) {
  // todo: branching logic for different game states
  const user = await requireAuthUser()
  const game = await getQuestionForGame(db, gameId)
  const sessionInfo = await getSessionInfoForPlayer(db, user.id, gameId)

  if (!game || !sessionInfo) {
    notFound()
  }

  return <GameLayout gameInfo={game} sessionInfo={sessionInfo} />
}

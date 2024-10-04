import React from "react"
import { notFound } from "next/navigation"

import { GameManagerProvider } from "~/components/game-screen/GameManagerProvider"
import { GameScreen } from "~/components/game-screen/GameScreen"
import InGameNavBar from "~/components/game-screen/InGameNavBar"
import { requireAuthUser } from "~/lib/auth/user"
import { db } from "~/lib/db"
import { getInGameState, getSessionInfoForPlayer } from "~/lib/games/queries"

export default async function GamePage({ params: { gameId } }: { params: { gameId: string } }) {
  const [user, game] = await Promise.all([requireAuthUser(), getInGameState(db, gameId)])
  const sessionInfo = await getSessionInfoForPlayer(db, user.id, gameId)

  if (!game || !sessionInfo) {
    notFound()
  }

  return (
    <GameManagerProvider initialGameState={game} initialPlayerSession={sessionInfo} user={user}>
      <div className="flex h-full flex-col">
        <InGameNavBar />
        <div className="flex-1">
          <GameScreen />
        </div>
      </div>
    </GameManagerProvider>
  )
}

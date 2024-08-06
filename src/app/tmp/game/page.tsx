import { redirect } from "next/navigation"

import { db } from "~/lib/db"
import { getLatestActiveGameForCurrentUser } from "~/lib/games/queries"
import { GameJoinButton } from "./client"

export default async function TmpGamePage() {
  const currentGame = await getLatestActiveGameForCurrentUser(db)

  if (currentGame) {
    return redirect(`/tmp/game/${currentGame.game.id}`)
  }

  return (
    <div>
      <GameJoinButton />
    </div>
  )
}

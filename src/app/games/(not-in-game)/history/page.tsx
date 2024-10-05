import { GameHistory } from "~/components/game-history/GameHistory"
import { requireAuthUser } from "~/lib/auth/user"
import { db } from "~/lib/db"
import { getUserGameHistory } from "~/lib/games/queries"

export default async function GameHistoryPage() {
  const user = await requireAuthUser()
  const initialHistoryPage = await getUserGameHistory(db, {
    userId: user.id,
  })

  return <GameHistory initialHistoryPage={initialHistoryPage} />
}

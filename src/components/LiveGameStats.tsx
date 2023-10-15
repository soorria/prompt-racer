import React from "react"
import LeaderboardPanel from "./LeaderboardPanel"
import { InferQueryOutput } from "~/lib/convex"
import { api } from "~convex/api"
import CountdownTimer from "./CountdownTimer"
import IngameTimer from "./IngameTimer"
import { User2, Users2 } from "lucide-react"

type Props = {
  game: NonNullable<InferQueryOutput<typeof api.games.getGameInfoForUser>["game"]>
}

export default function LiveGameStats({ game }: Props) {
  return (
    <div className="p-4 bg-card h-full rounded-lg shadow-md relative pt-24">
      <div className="top-5 left-4 absolute flex flex-col opacity-20 hover:opacity-50 transition-opacity">
        <div className="flex items-center gap-3">
          <Users2 className="h-9 w-9" />
          <p className="text-2xl">{game?.players?.length}</p>
        </div>
        <p className="text-xs font-bold">Players</p>
      </div>
      <div className="absolute right-0 top-0">
        <IngameTimer endTime={game.gameEndTime} />
      </div>

      <LeaderboardPanel users={game.players} />
    </div>
  )
}

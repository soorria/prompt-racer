import { Medal, Trophy } from "lucide-react"

import type { Doc } from "~/lib/db/types"
import { cn } from "~/lib/utils"
import UserAvatar from "../nav-bar/UserAvatar"

type LeaderboardTopThreeProps = {
  players: Doc<"users">[]
}

const PlayerCard = ({
  player,
  rank,
  isGold,
}: {
  player: Doc<"users"> | undefined
  rank: number
  isGold?: boolean
}) => {
  if (!player) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-lg bg-gray-700 p-4",
          isGold ? "h-full" : "h-[90%]",
        )}
      >
        <p className="text-gray-400">This could be you!</p>
      </div>
    )
  }

  if (isGold) {
    return (
      <div className="flex h-full w-full flex-row items-center gap-4 rounded-lg bg-yellow-900 p-4 sm:flex-col">
        <div className="relative flex flex-col items-center sm:mb-2">
          <UserAvatar size="lg" name={player.name} imageUrl={player.profile_image_url} />
          <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-transparent to-black/50"></div>
          <Trophy className="pointer-events-none absolute -bottom-2 h-8 w-8 text-yellow-400" />
        </div>

        {/* Player Name and Rank in a single row on mobile, stacked on larger screens */}
        <div className="flex h-full w-full flex-col justify-between sm:w-auto sm:flex-col sm:items-center sm:text-center">
          <div className="grid w-full flex-row place-content-center items-center gap-2 max-sm:grid-cols-[1fr_auto] sm:flex-col">
            <p className="max-w-full truncate text-xl font-semibold">{player.name}</p>
            <p className="text-sm text-gray-400">Rank #{rank}</p>
          </div>

          {/* Wins at the bottom on all screens */}
          <div className="mt-4">
            <p className="text-center text-2xl font-bold">{player.wins}</p>
            <p className="text-center text-sm text-gray-400">wins</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[90%] w-full flex-row items-center gap-4 rounded-lg bg-gray-700 p-4 sm:flex-col">
      <div className="relative mx-2 flex flex-col items-center sm:mb-2">
        <UserAvatar size="md" name={player.name} imageUrl={player.profile_image_url} />
        <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-transparent to-black/50"></div>
        <Medal className="pointer-events-none absolute -bottom-2 h-6 w-6 text-gray-300" />
      </div>

      {/* Player Name and Rank in a single row on mobile, stacked on larger screens */}
      <div className="flex h-full w-full flex-col justify-between sm:w-auto sm:flex-col sm:items-center sm:text-center">
        <div className="grid w-full flex-row place-content-center items-center gap-2 max-sm:grid-cols-[1fr_auto] sm:flex-col">
          <p className="max-w-full truncate text-lg font-semibold">{player.name}</p>
          <p className="text-sm text-gray-400">Rank #{rank}</p>
        </div>

        {/* Wins at the bottom on all screens */}
        <div className="mt-4">
          <p className="text-center text-xl font-bold">{player.wins}</p>
          <p className="text-center text-sm text-gray-400">wins</p>
        </div>
      </div>
    </div>
  )
}

export default function LeaderboardHighlight({ players }: LeaderboardTopThreeProps) {
  return (
    <div className="my-10">
      <div className="slide-in flex w-full flex-col gap-3 sm:grid sm:grid-flow-col-dense sm:grid-cols-3 sm:items-center sm:gap-0">
        <div className="relative z-10 w-full sm:col-start-2">
          <div className="sm:scale-110">
            <PlayerCard player={players[0]} rank={1} isGold />
          </div>
        </div>
        <div className="w-full">
          <PlayerCard player={players[1]} rank={2} />
        </div>
        <div className="w-full">
          <PlayerCard player={players[2]} rank={3} />
        </div>
      </div>
    </div>
  )
}

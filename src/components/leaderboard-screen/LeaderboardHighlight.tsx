import { Medal, Trophy } from "lucide-react"

import type { Doc } from "~/lib/db/types"
import { cn } from "~/lib/utils"
import UserAvatar from "../nav-bar/UserAvatar"
import { Avatar } from "../ui/avatar"

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
      <div
        key={player.id}
        className="flex h-full w-[33%] flex-col items-center rounded-lg bg-yellow-900 p-4"
      >
        <div className="mb-2 flex flex-col items-center space-y-2">
          <Trophy className="h-8 w-8 text-yellow-400" />
          <Avatar className="h-20 w-20">
            <UserAvatar size="lg" imageUrl={player.profile_image_url} />
          </Avatar>
        </div>
        <p className="max-w-full overflow-hidden text-ellipsis text-nowrap text-xl font-semibold">
          {player.name}
        </p>
        <p className="text-sm text-gray-400">Rank #{rank}</p>
        <p className="mt-2 text-2xl font-bold">{player.wins}</p>
        <p className="text-sm text-gray-400">wins</p>
      </div>
    )
  }

  return (
    <div
      key={player.id}
      className="flex h-[90%] w-[28%] flex-col items-center rounded-lg bg-gray-700 p-4"
    >
      <div className="mb-2 flex flex-col items-center space-y-2">
        <Medal className="h-6 w-6 text-gray-300" />
        <Avatar className="h-16 w-16">
          <UserAvatar size="md" imageUrl={player.profile_image_url} />
        </Avatar>
      </div>
      <p className="max-w-full overflow-hidden text-ellipsis text-nowrap text-lg font-semibold">
        {player.name}
      </p>
      <p className="text-sm text-gray-400">Rank #{rank}</p>
      <p className="mt-2 text-xl font-bold">{player.wins}</p>
      <p className="text-sm text-gray-400">wins</p>
    </div>
  )
}

export default function LeaderboardHighlight({ players }: LeaderboardTopThreeProps) {
  return (
    <div className="my-10 flex justify-center">
      <div className="flex w-full items-end justify-center space-x-4">
        <PlayerCard player={players[1]} rank={2} />
        <PlayerCard player={players[0]} rank={1} isGold />
        <PlayerCard player={players[2]} rank={3} />
      </div>
    </div>
  )
}

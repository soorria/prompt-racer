import { Medal, Trophy } from "lucide-react"

import type { Doc } from "~/lib/db/types"
import { cn } from "~/lib/utils"
import UserAvatar from "../nav-bar/UserAvatar"
import { Avatar } from "../ui/avatar"

type LeaderboardTopThreeProps = {
  players: [Doc<"users"> | undefined, Doc<"users"> | undefined, Doc<"users"> | undefined]
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
        className={cn("flex flex-col items-center justify-center rounded-lg bg-gray-700 p-4", {
          "h-full": isGold,
          "h-[90%]": !isGold,
        })}
      >
        <p className="text-gray-400">Player not found</p>
      </div>
    )
  }

  return (
    <div
      key={player.id}
      className={`flex flex-col items-center rounded-lg ${
        isGold ? "bg-yellow-900" : "bg-gray-700"
      } p-4`}
      style={{ width: isGold ? "33%" : "28%", height: isGold ? "full" : "90%" }}
    >
      <div className="mb-2 flex flex-col items-center space-y-2">
        {rank === 1 ? (
          <Trophy className="h-8 w-8 text-yellow-400" />
        ) : (
          <Medal className={`h-6 w-6 ${rank === 2 ? "text-gray-300" : "text-amber-600"}`} />
        )}
        <Avatar className={cn(isGold ? "h-20 w-20" : "h-16 w-16")}>
          <UserAvatar size={isGold ? "lg" : "md"} imageUrl={player.profile_image_url} />
        </Avatar>
      </div>
      <p
        className={cn(
          isGold ? "text-xl" : "text-lg",
          "max-w-full overflow-hidden text-ellipsis text-nowrap font-semibold",
        )}
      >
        {player.name}
      </p>
      <p className="text-sm text-gray-400">Rank #{rank}</p>
      <p className={`mt-2 text-${isGold ? "2xl" : "xl"} font-bold`}>{player.wins}</p>
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

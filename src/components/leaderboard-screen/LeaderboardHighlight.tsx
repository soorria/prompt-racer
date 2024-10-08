import { Medal, Trophy } from "lucide-react"

import type { Doc } from "~/lib/db/types"
import { type LeaderboardOrdering } from "~/lib/leaderboard/queries"
import { cn } from "~/lib/utils"
import UserAvatar from "../nav-bar/UserAvatar"

type LeaderboardTopThreeProps = {
  players: (Doc<"userProfiles"> & { winCondition: { label: string; value: string } })[]
  podiumNoPlayerPlaceholder: string
}

const numberFormatter = new Intl.NumberFormat("en")

export const ORDERING_DETAILS: Record<
  LeaderboardOrdering,
  {
    label: string
    getValue: (player: Doc<"userProfiles">) => string | number
  }
> = {
  "games-played": {
    label: "Games Played",
    getValue: (player) => numberFormatter.format(player.gamesPlayed),
  },
  "win-rate": {
    label: "Win Rate",
    getValue: (player) => `${((player.winRate ?? 0) * 100).toFixed(2)}%`,
  },
  wins: {
    label: "Wins",
    getValue: (player) => numberFormatter.format(player.wins),
  },
}

const PlayerCard = ({
  player,
  rank,
  winCondition,
  noPlayerPlaceholder,
}: {
  player: Doc<"userProfiles"> | undefined
  rank: number
  winCondition: { label: string; value: string } | undefined
  noPlayerPlaceholder: string
}) => {
  const isGold = rank === 0

  if (!player) {
    return (
      <div
        className={cn(
          "flex h-full flex-col items-center justify-center rounded-lg p-4",
          isGold ? "bg-gray-700" : "bg-gray-800",
        )}
      >
        <p className="text-gray-400">{noPlayerPlaceholder}</p>
      </div>
    )
  }

  if (isGold) {
    return (
      <div className="flex h-full w-full flex-row items-center gap-4 rounded-lg bg-yellow-800 px-4 py-4 shadow-md shadow-yellow-800/75 sm:flex-col sm:py-6">
        <div className="relative flex flex-col items-center">
          <UserAvatar size="lg" name={player.name} imageUrl={player.profile_image_url} />
          <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-transparent to-yellow-950/50"></div>
          <Trophy
            aria-hidden
            className="pointer-events-none absolute -bottom-2 animate-pulse text-yellow-400 blur sq-8"
          />
          <Trophy className="pointer-events-none absolute -bottom-2 text-yellow-400 sq-8" />
        </div>

        {/* Player Name and Rank in a single row on mobile, stacked on larger screens */}
        <div className="flex h-full w-full flex-col justify-between gap-4 sm:w-auto sm:flex-col sm:items-center sm:text-center">
          <div className="grid w-full flex-row place-content-center items-center gap-2 max-sm:grid-cols-[1fr_auto] sm:flex-col">
            <p className="max-w-full truncate text-lg font-semibold sm:text-2xl">{player.name}</p>
            <p className="text-base text-gray-300">Rank #{rank}</p>
          </div>

          {/* Wins at the bottom on all screens */}
          <div>
            <p className="text-left text-lg font-bold sm:text-center sm:text-xl">
              {winCondition?.label}
            </p>
            <p className="text-left text-sm text-gray-300 sm:text-center">{winCondition?.value}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-row items-center gap-4 rounded-lg bg-gray-700 p-4 sm:flex-col">
      <div className="relative mx-2 flex flex-col items-center sm:mb-2">
        <UserAvatar size="md" name={player.name} imageUrl={player.profile_image_url} />
        <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-transparent to-black/50"></div>
        <Medal
          className={cn("pointer-events-none absolute -bottom-2 text-gray-300 sq-6", {
            "text-gray-400": rank === 1,
            "text-yellow-700": rank === 2,
          })}
        />
      </div>

      {/* Player Name and Rank in a single row on mobile, stacked on larger screens */}
      <div className="flex h-full w-full flex-col justify-between gap-4 sm:w-auto sm:flex-col sm:items-center sm:text-center">
        <div className="grid w-full flex-row place-content-center items-center gap-2 max-sm:grid-cols-[1fr_auto] sm:flex-col">
          <p className="text-md max-w-full truncate font-semibold sm:text-lg">{player.name}</p>
          <p className="text-sm text-gray-400">Rank #{rank}</p>
        </div>

        {/* Wins at the bottom on all screens */}
        <div>
          <p className="text-left text-lg font-bold sm:text-center sm:text-xl">
            {winCondition?.label}
          </p>
          <p className="text-left text-sm text-gray-400 sm:text-center">{winCondition?.value}</p>
        </div>
      </div>
    </div>
  )
}

export default function LeaderboardHighlight({
  players,
  podiumNoPlayerPlaceholder,
}: LeaderboardTopThreeProps) {
  return (
    <div className="my-5 sm:my-10">
      <div
        className={cn(
          "slide-in flex min-h-72 min-w-full flex-col gap-3 sm:grid sm:grid-flow-col-dense sm:grid-cols-3 sm:items-center sm:gap-0",
        )}
      >
        <div className="relative z-10 h-full w-full flex-1 sm:col-start-2">
          <div className="h-full sm:scale-110">
            <PlayerCard
              player={players[0]}
              rank={0}
              winCondition={players[0]?.winCondition}
              noPlayerPlaceholder={podiumNoPlayerPlaceholder}
            />
          </div>
        </div>
        <div className="h-[90%] w-full">
          <PlayerCard
            player={players[1]}
            rank={1}
            winCondition={players[1]?.winCondition}
            noPlayerPlaceholder={podiumNoPlayerPlaceholder}
          />
        </div>
        <div className="h-[90%] w-full">
          <PlayerCard
            player={players[2]}
            rank={2}
            winCondition={players[2]?.winCondition}
            noPlayerPlaceholder={podiumNoPlayerPlaceholder}
          />
        </div>
      </div>
    </div>
  )
}

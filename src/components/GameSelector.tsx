import { cx } from "class-variance-authority"
import { CheckIcon, GalleryHorizontalEnd, Play, Timer, Trophy } from "lucide-react"
import React from "react"
import GameModeSelectionButton from "./GameModeSelectionButton"

type Props = {}

const tiers = [
  // {
  //   name: "Least Tokens",
  //   id: "tier-least-tokens",
  //   description: "Use the fewest tokens possible to solve the problem.",
  //   icon: <CheckIcon size={120} />,
  //   gamesPlayed: 7,
  //   timesWon: 3,
  // },
  {
    name: "Fastest Player!",
    id: "tier-fastest-player",
    description: "This game mode is timed, solve the problem first to win!",
    icon: <Timer size={120} />,
    gamesPlayed: 10,
    timesWon: 5,
  },
  // {
  //   name: "Optimal Solution",
  //   id: "tier-optimal-solution",
  //   description: "Find the most efficient solution to the problem.",
  //   icon: <Play size={120} />,
  //   gamesPlayed: 12,
  //   timesWon: 4,
  // },
]

export default function GameSelector({}: Props) {
  return (
    <div className="max-w-md mx-auto">
      <div className="isolate mx-auto mt-16 grid gap-4 grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:grid-cols-1">
        {tiers.map((tier, tierIdx) => (
          <div
            key={tier.id}
            className={cx(
              "flex relative flex-col justify-between rounded-3xl bg-card p-8 ring-1 ring-gray-200/20 gap-4"
            )}
          >
            <div className="">
              <div className="flex items-center justify-between gap-x-4 w-full">
                <>
                  <p
                    className="text-zinc-400 hover:text-zinc-100 flex absolute left-4 items-center justify-center space-x-1 rounded-full bg-zinc-500/10 hover:bg-zinc-500/20 transition-colors duration-200 ease-in-out px-2.5 py-1 text-xs font-semibold leading-5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500/50"
                    aria-label="Played 5 times"
                  >
                    <GalleryHorizontalEnd />
                    <span>{tier.gamesPlayed}</span>
                  </p>
                  <p
                    className="text-zinc-400 hover:text-zinc-100 flex absolute right-4 items-center justify-center space-x-1 rounded-full bg-zinc-500/10 hover:bg-zinc-500/20 transition-colors duration-200 ease-in-out px-2.5 py-1 text-xs font-semibold leading-5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500/50"
                    aria-label="Played 5 times"
                  >
                    <Trophy />
                    <span>{tier.timesWon}</span>
                  </p>
                </>
              </div>
              <div className="flex justify-center mt-6">{tier.icon}</div>
              <h3 id={tier.id} className={cx("mt-6 first-letter:text-lg font-semibold")}>
                {tier.name}
              </h3>
              <p className="text-sm leading-6 text-zinc-500">{tier.description}</p>
            </div>
            <GameModeSelectionButton />
          </div>
        ))}
      </div>
    </div>
  )
}

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
    name: "Random Game Mode",
    id: "tier-fastest-player",
    description: "Start the game, and see what mode you get!",
    icon: <Trophy size={120} />,
    gamesPlayed: 10,
    timesWon: 5,
  },
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
              <div className="flex justify-center mb-6">{tier.icon}</div>
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

import clsx from "clsx"
import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Doc } from "~convex/dataModel"

type GamePlayerInfo = NonNullable<Doc<"game">["players"]>[number]
type GamePlayerInfoWithPosition = GamePlayerInfo & { position: number }
type GamePlayerInfoDNF = GamePlayerInfo & { position: "nah" }

type FinishGameScreenProps = {
  players?: GamePlayerInfo[]
}

const getPositionBgColorClass = (position: number): string => {
  return ["bg-orange-300", "bg-zinc-500", "bg-red-900"][position - 1] ?? "bg-card"
}

const getPositionSuffix = (position: number): string => {
  const lastDigit = position.toString().slice(-1)
  return (
    {
      "1": "st",
      "2": "nd",
      "3": "rd",
    }[lastDigit] || "th"
  )
}

export default function FinishGameScreen({ players = [] }: FinishGameScreenProps) {
  const sortedPlayers = [...players]
    .map((p) => ({ ...p, position: p.position ?? "nah" }))
    .sort((a, b) => {
      if (a.position === "nah") return 1
      if (b.position === "nah") return -1

      if (typeof a.position === "undefined") return 1
      if (typeof b.position === "undefined") return -1

      return a.position - b.position
    })

  const { podium, otherFinished, dnf } = (() => {
    const finished: GamePlayerInfoWithPosition[] = []
    const dnf: GamePlayerInfoDNF[] = []

    for (const player of sortedPlayers) {
      if (typeof player.position === "number") {
        finished.push(player as GamePlayerInfoWithPosition)
      } else {
        dnf.push(player as GamePlayerInfoDNF)
      }
    }

    return {
      podium: finished.slice(0, 3),
      otherFinished: finished.slice(3),
      dnf,
    }
  })()

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold tracking-tight max-w-2xl mx-auto text-center sm:text-6xl my-10">
        Leaderboard
      </h1>

      {podium.map((player) => {
        return <LeaderboardItem player={player} type="podium" key={player.userId} />
      })}

      {otherFinished.length > 0 && (
        <ul className="mt-5 max-w-5xl mx-auto">
          {otherFinished.map((player) => (
            <LeaderboardItem player={player} type="default" key={player.userId} />
          ))}
        </ul>
      )}

      {dnf.length > 0 ? (
        <>
          <h3 className="text-lg font-bold mt-8 mb-2">Could not Finish 😭</h3>
          <ul className="mt-5 max-w-5xl mx-auto divide-y divide-gray-300/50">
            {dnf.map((player) => (
              <LeaderboardItem player={player} type="default" key={player.userId} />
            ))}
          </ul>
        </>
      ) : null}
    </div>
  )
}

function LeaderboardItem(
  props:
    | { player: GamePlayerInfoWithPosition; type: "podium" }
    | { player: GamePlayerInfo; type: "default" }
) {
  const ratingChange =
    props.player.starting_rating && props.player.ending_rating
      ? props.player.ending_rating - props.player.starting_rating
      : 0

  let ratingChangeDisplayText = "No rating change"
  if (ratingChange > 0) {
    ratingChangeDisplayText = `+${ratingChange}`
  } else if (ratingChange < 0) {
    ratingChangeDisplayText = `-${ratingChange}`
  }

  const ratingChangeColor = clsx({
    "text-green-500": ratingChange > 0,
    "text-red-500": ratingChange < 0,
    "text-gray-500": ratingChange === 0,
  })

  if (props.type === "podium") {
    return (
      <div className="relative overflow-hidden rounded-lg bg-card shadow flex justify-center items-center">
        <p className="flex flex-1 items-center px-4 py-5 gap-5">
          <Avatar>
            <AvatarImage src={props.player.profilePictureUrl} />
            <AvatarFallback>{props.player.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-2xl font-semibold">{props.player.name}</p>
            <p className={ratingChangeColor}>{ratingChangeDisplayText}</p>
          </div>
        </p>
        {/* No clue why, but i could not make the background + position work as 1 element */}
        <div
          className={clsx(
            "absolute right-0 inset-y-0 w-24 z-10",
            getPositionBgColorClass(props.player.position + 1)
          )}
        />
        <div className={clsx("w-24 grid place-content-center min-h-full h-full relative z-10")}>
          <span className="text-5xl font-display text-card" aria-hidden="true">
            {props.player.position + 1}
            <sup>{getPositionSuffix(props.player.position + 1)}</sup>
          </span>
        </div>
      </div>
    )
  } else {
    return (
      <li className="flex items-center py-3">
        <Avatar className="mr-4">
          <AvatarImage src={props.player.profilePictureUrl} />
          <AvatarFallback>{props.player.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p>{props.player.name}</p>
          <p className={clsx(ratingChangeColor, "text-sm")}>{ratingChange}</p>
        </div>

        <div className="flex-1" />
        {props.player.position !== "nah" && <div className="opacity-50 mr-3">nah</div>}
      </li>
    )
  }
}

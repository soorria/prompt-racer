import clsx from "clsx"
import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Doc } from "~convex/dataModel"

type Props = {
  players?: NonNullable<Doc<"game">["players"]>
}

export default function FinishGameScreen({ players = [] }: Props) {
  const sortedPlayers = [...players].sort((a, b) => {
    if (a.position === "nah") return 1
    if (b.position === "nah") return -1

    if (typeof a.position === "undefined") return 1
    if (typeof b.position === "undefined") return -1

    return a.position - b.position
  })

  const getColour = (index: number): string[] => {
    switch (index) {
      case 0:
        return ["bg-orange-300", "st"]
      case 1:
        return ["bg-zinc-500", "nd"]
      case 2:
        return ["bg-red-900", "rd"]
      default:
        return ["bg-card"]
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold tracking-tight max-w-2xl mx-auto text-center sm:text-6xl my-10">
        Leaderboard
      </h1>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mx-auto">
        {sortedPlayers.slice(0, 3).map((player, index) => (
          <>
            {player.position !== "nah" && (
              <>
                <div
                  key={player.userId}
                  className="relative overflow-hidden rounded-lg bg-card shadow flex justify-center items-center"
                >
                  <dd className="flex flex-1 items-center px-4 py-5">
                    <Avatar>
                      <AvatarImage src={player.profilePictureUrl} />
                      <AvatarFallback>{player.name[0]}</AvatarFallback>
                    </Avatar>
                    <p className="text-2xl ml-5 font-semibold">{player.name}</p>
                  </dd>
                  <dt
                    className={clsx("w-24 h-full grid place-content-center", getColour(index)[0])}
                  >
                    <span className="text-5xl font-display text-white" aria-hidden="true">
                      {index + 1}
                      <sup>{getColour(index)[1]}</sup>
                    </span>
                  </dt>
                </div>
              </>
            )}
          </>
        ))}
      </dl>
      <ul className="mt-5 max-w-5xl mx-auto">
        {sortedPlayers.slice(3).map(
          (player) =>
            player.position !== "nah" && (
              <li
                key={player.userId}
                className="flex items-center py-2 border-b border-gray-300/50"
              >
                <span className="opacity-50 w-8 mr-3">#{player.position}</span>
                <Avatar className="mr-4">
                  <AvatarImage src={player.profilePictureUrl} />
                  <AvatarFallback>{player.name[0]}</AvatarFallback>
                </Avatar>
                <span>{player.name}</span>
              </li>
            )
        )}
      </ul>
      {sortedPlayers.filter((p) => p.position === "nah").length !== 0 && (
        <h3 className="text-lg font-bold mt-8 mb-2">Could not Finish 😭</h3>
      )}
      <ul className="mt-5 max-w-5xl mx-auto">
        {sortedPlayers.map(
          (player) =>
            player.position === "nah" && (
              <li
                key={player.userId}
                className="flex items-center py-2 border-b border-gray-300/50"
              >
                <span className="opacity-50 mr-3">nah</span>
                <Avatar className="mr-4">
                  <AvatarImage src={player.profilePictureUrl} />
                  <AvatarFallback>{player.name[0]}</AvatarFallback>
                </Avatar>
                <span>{player.name}</span>
              </li>
            )
        )}
      </ul>
    </div>
  )
}

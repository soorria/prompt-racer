import { Medal, Trophy } from "lucide-react"

import type { GameMode } from "~/lib/games/constants"
import { type GameResultsPlayer } from "~/app/games/results/[gameId]/page"
import { GAME_MODE_DETAILS } from "~/lib/games/constants"
import { cn } from "~/lib/utils"
import { getPositionRowClasses } from "../leaderboard-screen/class-utils"
import LeaderboardTablePlayerName from "../leaderboard-screen/LeaderboardTablePlayerName"

export function ResultsTable({
  users,
  gameMode,
}: {
  users: GameResultsPlayer[]
  gameMode: GameMode
}) {
  const { unitLong, unitShort } = GAME_MODE_DETAILS[gameMode]

  return (
    <div className="-mx-4 mt-4 flow-root overflow-x-scroll px-4 sm:mt-16">
      <table
        className="slide-in-direct mx-auto w-full max-w-2xl border-separate border-spacing-0"
        style={{
          "--initial-step": 3,
        }}
      >
        <thead>
          <tr>
            <th
              scope="col"
              className="sticky top-0 z-10 w-5 rounded-tl-xl border-b border-gray-700 bg-zinc-800 bg-opacity-25 py-3.5 pl-3 text-right text-sm font-semibold text-gray-200 backdrop-blur-md backdrop-filter sm:pr-3"
            >
              <span aria-hidden>#</span>
              <span className="sr-only">Rank</span>
            </th>
            <th
              scope="col"
              className="sticky top-0 z-10 border-b border-gray-700 bg-zinc-800/25 px-3 py-3.5 text-left text-sm font-semibold text-gray-200 backdrop-blur-md backdrop-filter"
            >
              Player
            </th>

            {/* <th
              scope="col"
              className="sticky top-0 z-10 border-b border-gray-700 bg-zinc-800/25 px-3 py-3.5 text-right text-sm font-semibold text-gray-200 backdrop-blur-md backdrop-filter"
            >
              Score (<span className="hidden sm:inline">{unitLong}</span>
              <span className="sm:hidden">{unitShort}</span>)
            </th> */}

            <th
              scope="col"
              className="sticky top-0 z-10 rounded-tr-xl border-b border-gray-700 bg-zinc-800/25 px-3 py-3.5 text-right text-sm font-semibold text-gray-200 backdrop-blur-md backdrop-filter"
            ></th>
          </tr>
        </thead>
        <tbody
          className="slide-in"
          style={{
            "--initial-step": 4,
          }}
        >
          {users.map((player, idx) => {
            const isNotLastRow = idx !== users.length - 1

            const classes = getPositionRowClasses(idx)

            return (
              <tr
                key={player.id}
                style={{
                  "--step-num": idx.toString(),
                }}
                className={cn(
                  "group/row tabular-nums transition-colors duration-500 hover:duration-75",
                  classes.row,
                )}
              >
                <td
                  className={cn(
                    { "border-b border-gray-700/25": isNotLastRow, "rounded-bl-xl": !isNotLastRow },
                    "whitespace-nowrap py-4 pl-3 text-right text-sm font-medium text-gray-200 transition-colors duration-500 group-hover/row:duration-75 sm:pr-3",
                    classes.rankCell,
                  )}
                >
                  {idx}
                </td>

                {[
                  {
                    value: <LeaderboardTablePlayerName player={player.user} />,
                    align: "left",
                  },
                  // {
                  //   value: player.finalResult.score,
                  //   align: "right",
                  // },
                  {
                    value:
                      idx === 0 ? (
                        <Trophy className="pointer-events-none h-6 w-6 text-yellow-400" />
                      ) : idx === 1 || idx === 2 ? (
                        <Medal
                          className={cn("pointer-events-none h-6 w-6 text-gray-300", {
                            "text-gray-400": idx === 1,
                            "text-yellow-700": idx === 2,
                          })}
                        />
                      ) : null,
                    align: "right",
                  },
                ].map(({ value, align }, valueIdx, valuesArray) => {
                  const isLastColumn = valueIdx === valuesArray.length - 1
                  return (
                    <td
                      key={valueIdx}
                      className={cn(
                        {
                          "border-b border-gray-700/25": isNotLastRow,
                          "text-left": align === "left",
                          "text-right": align === "right",
                        },
                        "whitespace-nowrap px-3 py-4 text-sm text-gray-400",
                        {
                          "rounded-br-xl": !isNotLastRow && isLastColumn,
                        },
                      )}
                    >
                      <div
                        className={cn({
                          "ml-auto flex justify-start": align === "left",
                          "mr-auto flex justify-end": align === "right",
                        })}
                      >
                        {value}
                      </div>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

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
              <span aria-hidden>#Rank</span>
              <span className="sr-only">Rank</span>
            </th>
            <th
              scope="col"
              className="sticky top-0 z-10 border-b border-gray-700 bg-zinc-800/25 px-3 py-3.5 text-left text-sm font-semibold text-gray-200 backdrop-blur-md backdrop-filter"
            >
              Player
            </th>

            <th
              scope="col"
              className="sticky top-0 z-10 rounded-tr-xl border-b border-gray-700 bg-zinc-800/25 px-3 py-3.5 text-right text-sm font-semibold text-gray-200 backdrop-blur-md backdrop-filter"
            >
              Score (<span className="hidden sm:inline">{unitLong}</span>
              <span className="sm:hidden">{unitShort}</span>)
            </th>
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
            const hasFinalSubmission = player.submission_state_id !== null
            const classes = getPositionRowClasses(idx)

            return (
              <tr
                key={player.id}
                style={{
                  "--step-num": idx.toString(),
                }}
                className={cn(
                  "group/row tabular-nums transition-colors duration-500 hover:duration-75",
                  { [classes.row]: hasFinalSubmission },
                  {
                    "wiggle bg-zinc-900": !hasFinalSubmission,
                  },
                )}
              >
                <td
                  className={cn(
                    { "border-b border-gray-700/25": isNotLastRow, "rounded-bl-xl": !isNotLastRow },
                    "whitespace-nowrap py-4 pl-3 text-right text-sm font-medium text-gray-200 transition-colors duration-500 group-hover/row:duration-75 sm:pr-3",
                    { [classes.rankCell]: hasFinalSubmission },
                  )}
                >
                  {hasFinalSubmission ? (
                    idx
                  ) : (
                    <>
                      2<sup>31</sup>-1
                    </>
                  )}
                </td>

                {[
                  {
                    key: "player-name",
                    value: <LeaderboardTablePlayerName player={player.user} />,
                    align: "left",
                  },
                  {
                    key: "score",
                    value: player.finalResult.score,
                    align: "right",
                  },
                ].map(({ key, value, align }, valueIdx, valuesArray) => {
                  const isLastColumn = valueIdx === valuesArray.length - 1
                  return (
                    <td
                      key={key}
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
                        <span
                          className={cn({
                            "line-through": !hasFinalSubmission,
                          })}
                        >
                          {value}
                        </span>
                        {!hasFinalSubmission && key === "player-name" && (
                          <span className="ml-2">(No submission)</span>
                        )}
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

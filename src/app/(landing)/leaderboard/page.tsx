import { redirect } from "next/navigation"

import { getPositionRowClasses } from "~/components/leaderboard-screen/class-utils"
import LeaderboardHighlight, {
  ORDERING_DETAILS,
} from "~/components/leaderboard-screen/LeaderboardHighlight"
import LeaderboardTablePlayerName from "~/components/leaderboard-screen/LeaderboardTablePlayerName"
import { LeaderboardTabs } from "~/components/leaderboard-screen/LeaderboardTabs"
import { PlayerConfetti } from "~/components/leaderboard-screen/PlayerConfetti"
import LocalDate from "~/components/LocalDate"
import { type Doc } from "~/lib/db/types"
import { getGlobalLeaderboard, leaderboardOrderingSchema } from "~/lib/leaderboard/queries"
import { cn } from "~/lib/utils"

export const revalidate = 10

export default async function LeaderboardPage(props: {
  params: {
    ordering?: string
  }
}) {
  const ordering = resolveOrderingOrRedirect(props.params.ordering)

  const { leaderboard, updatedAt } = await getGlobalLeaderboard(ordering)

  return (
    <div className="mx-auto max-w-screen-lg">
      <h1 className="mx-auto my-6 max-w-4xl text-center text-4xl font-bold tracking-tight text-white sm:my-14 sm:text-5xl">
        Global Leaderboard
      </h1>

      <PlayerConfetti leaderUserId={leaderboard[0]?.id} />

      <div className="my-8 flex justify-center">
        <LeaderboardTabs ordering={ordering} />
      </div>

      <LeaderboardHighlight
        podiumNoPlayerPlaceholder="This could be you!"
        players={leaderboard.slice(0, 3).map((p) => ({
          ...p,
          winCondition: {
            label: ORDERING_DETAILS[ordering].label,
            value: `${ORDERING_DETAILS[ordering].getValue(p)}`,
          },
        }))}
      />

      {leaderboard.length ? <LeaderboardTable users={leaderboard} /> : null}

      <div className="mb-8 mt-24 text-center text-sm text-zinc-400">
        Last updated at <LocalDate date={updatedAt} />
      </div>
    </div>
  )
}

function LeaderboardTable({ users }: { users: Doc<"userProfiles">[] }) {
  return (
    <div className="-mx-4 mt-16 flow-root overflow-x-scroll px-4">
      <table
        className="slide-in-direct min-w-full border-separate border-spacing-0"
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
            <th
              scope="col"
              className="sticky top-0 z-10 border-b border-gray-700 bg-zinc-800/25 px-3 py-3.5 text-right text-sm font-semibold text-gray-200 backdrop-blur-md backdrop-filter"
            >
              {ORDERING_DETAILS.wins.label}
            </th>
            <th
              scope="col"
              className="sticky top-0 z-10 border-b border-gray-700 bg-zinc-800/25 px-3 py-3.5 text-right text-sm font-semibold text-gray-200 backdrop-blur-md backdrop-filter"
            >
              {ORDERING_DETAILS["games-played"].label}
            </th>
            <th
              scope="col"
              className="sticky top-0 z-10 rounded-tr-xl border-b border-gray-700 bg-zinc-800/25 px-3 py-3.5 text-right text-sm font-semibold text-gray-200 backdrop-blur-md backdrop-filter"
            >
              {ORDERING_DETAILS["win-rate"].label}
            </th>
          </tr>
        </thead>
        <tbody
          className="slide-in-direct rounded-b-lg"
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
                    value: <LeaderboardTablePlayerName player={player} />,
                    align: "left",
                  },
                  { value: ORDERING_DETAILS.wins.getValue(player), align: "right" },
                  { value: ORDERING_DETAILS["games-played"].getValue(player), align: "right" },
                  { value: ORDERING_DETAILS["win-rate"].getValue(player), align: "right" },
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
                      {value}
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

function resolveOrderingOrRedirect(ordering: string | undefined) {
  const parseResult = leaderboardOrderingSchema.safeParse(ordering ?? "wins")

  if (!parseResult.success) {
    return redirect("/leaderboard/wins")
  }

  return parseResult.data
}

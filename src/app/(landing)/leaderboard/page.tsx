import LeaderboardHighlight from "~/components/leaderboard-screen/LeaderboardHighlight"
import LocalDate from "~/components/LocalDate"
import { type Doc } from "~/lib/db/types"
import { api } from "~/lib/trpc/server"
import { cn } from "~/lib/utils"

export const revalidate = 60

export default async function LeaderboardPage() {
  const users = await api.leaderboard.getLeaderboard()

  return (
    <div>
      <h1 className="mb-16 mt-8 text-center text-3xl font-bold tracking-tight sm:text-4xl">
        Leaderboard
      </h1>

      <LeaderboardHighlight players={users.slice(0, 3)} />

      {users.length ? <LeaderboardTable users={users} /> : null}

      <div className="mb-8 mt-24 text-center text-sm text-zinc-400">
        Last updated at <LocalDate date={new Date()} />
      </div>
    </div>
  )
}

function LeaderboardTable({ users }: { users: Doc<"users">[] }) {
  return (
    <div className="mt-16 flow-root">
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
              className="sticky top-0 z-10 rounded-tl-xl border-b border-gray-700 bg-zinc-800 bg-opacity-25 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-200 backdrop-blur-md backdrop-filter sm:pl-6 lg:pl-8"
            >
              Global Rank
            </th>
            <th
              scope="col"
              className="sticky top-0 z-10 border-b border-gray-700 bg-zinc-800 bg-opacity-25 px-3 py-3.5 text-left text-sm font-semibold text-gray-200 backdrop-blur-md backdrop-filter"
            >
              Username
            </th>
            <th
              scope="col"
              className="sticky top-0 z-10 border-b border-gray-700 bg-zinc-800 bg-opacity-25 px-3 py-3.5 text-left text-sm font-semibold text-gray-200 backdrop-blur-md backdrop-filter"
            >
              Wins
            </th>
            <th
              scope="col"
              className="sticky top-0 z-10 rounded-tr-xl border-b border-gray-700 bg-zinc-800 bg-opacity-25 px-3 py-3.5 text-left text-sm font-semibold text-gray-200 backdrop-blur-md backdrop-filter"
            >
              Games Played
            </th>
          </tr>
        </thead>
        <tbody
          className="slide-in"
          style={{
            "--initial-step": 4,
          }}
        >
          {users.map((player, idx) => (
            <tr
              key={player.id}
              style={{
                "--step-num": idx.toString(),
              }}
            >
              <td
                className={cn(
                  { "border-b border-gray-700/25": idx !== users.length - 1 },
                  "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-200 sm:pl-6 lg:pl-8",
                )}
              >
                {idx + 1}
              </td>
              <td
                className={cn(
                  { "border-b border-gray-700/25": idx !== users.length - 1 },
                  "whitespace-nowrap px-3 py-4 text-sm text-gray-400",
                )}
              >
                {player.name}
              </td>
              <td
                className={cn(
                  { "border-b border-gray-700/25": idx !== users.length - 1 },
                  "whitespace-nowrap px-3 py-4 text-sm text-gray-400",
                )}
              >
                {player.wins}
              </td>
              <td
                className={cn(
                  { "border-b border-gray-700/25": idx !== users.length - 1 },
                  "whitespace-nowrap px-3 py-4 text-sm text-gray-400",
                )}
              >
                {player.gamesPlayed}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

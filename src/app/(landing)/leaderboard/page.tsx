import LeaderboardHighlight from "~/components/leaderboard-screen/LeaderboardHighlight"
import { api } from "~/lib/trpc/server"
import { cn } from "~/lib/utils"

export const revalidate = 60

export default async function LeaderboardPage() {
  const users = await api.leaderboard.getLeaderboard()
  return (
    <div>
      <LeaderboardHighlight players={users.slice(0, 3)} />
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <table className="min-w-full border-separate border-spacing-0">
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
                      className="sticky top-0 z-10 rounded-tr-xl border-b border-gray-700 bg-zinc-800 bg-opacity-25 px-3 py-3.5 text-left text-sm font-semibold text-gray-200 backdrop-blur-md backdrop-filter"
                    >
                      Wins
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((player, idx) => (
                    <tr key={player.id}>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

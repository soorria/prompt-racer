import { Skeleton } from "~/components/ui/skeleton"

export default function LeaderboardPageLoading() {
  return (
    <div>
      <h1 className="my-16 text-center text-5xl font-bold tracking-tight sm:text-4xl">
        Leaderboard
      </h1>

      {/* Loading state for LeaderboardHighlight */}
      <div className="my-10 flex justify-center">
        <div className="flex w-full items-center justify-center space-x-4">
          <Skeleton className="h-36 w-1/4 rounded-lg" /> {/* Placeholder for rank 2 */}
          <Skeleton className="h-40 w-1/3 rounded-lg" /> {/* Placeholder for rank 1 */}
          <Skeleton className="h-36 w-1/4 rounded-lg" /> {/* Placeholder for rank 3 */}
        </div>
      </div>

      {/* Loading state for the table */}
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
                  {Array.from({ length: 10 }).map((_, idx) => (
                    <tr key={idx}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-200 sm:pl-6 lg:pl-8">
                        <Skeleton className="h-5 w-10" />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">
                        <Skeleton className="h-5 w-32" />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">
                        <Skeleton className="h-5 w-10" />
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

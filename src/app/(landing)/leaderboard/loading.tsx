import { Skeleton } from "~/components/ui/skeleton"

export default function LeaderboardPageLoading() {
  return (
    <div className="mx-auto max-w-screen-lg">
      <div className="my-8 flex justify-center">
        {/* Tabs Loading Skeleton */}
        <nav aria-label="Tabs" className="flex space-x-4">
          <Skeleton className="h-10 w-16 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-28 rounded-md" />
        </nav>
      </div>

      {/* Loading state for LeaderboardHighlight */}
      <div className="my-10 flex justify-center">
        <div className="flex w-full flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Skeleton className="h-24 w-full rounded-lg sm:h-64" />
          <Skeleton className="h-32 w-full rounded-lg sm:h-72" />
          <Skeleton className="h-24 w-full rounded-lg sm:h-64" />
        </div>
      </div>

      {/* Loading state for the table */}
      <div className="-mx-4 mt-16 flow-root overflow-x-scroll px-4">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th
                scope="col"
                className="sticky top-0 z-10 w-5 rounded-tl-xl border-b border-gray-700 bg-zinc-800 bg-opacity-25 py-3.5 pl-3 text-sm font-semibold text-gray-200 backdrop-blur-md backdrop-filter sm:pr-3"
              >
                <div className="flex justify-end">
                  <Skeleton className="h-5 w-10" />
                </div>
              </th>
              <th
                scope="col"
                className="sticky top-0 z-10 border-b border-gray-700 bg-zinc-800/25 px-3 py-3.5 text-left text-sm font-semibold text-gray-200 backdrop-blur-md backdrop-filter"
              >
                <Skeleton className="h-5 w-24" />
              </th>
              <th
                scope="col"
                className="sticky top-0 z-10 border-b border-gray-700 bg-zinc-800/25 px-3 py-3.5 text-sm font-semibold text-gray-200 backdrop-blur-md backdrop-filter"
              >
                <div className="flex justify-end">
                  <Skeleton className="h-5 w-10" />
                </div>
              </th>
              <th
                scope="col"
                className="sticky top-0 z-10 border-b border-gray-700 bg-zinc-800/25 px-3 py-3.5 text-sm font-semibold text-gray-200 backdrop-blur-md backdrop-filter"
              >
                <div className="flex justify-end">
                  <Skeleton className="h-5 w-10" />
                </div>
              </th>
              <th
                scope="col"
                className="sticky top-0 z-10 rounded-tr-xl border-b border-gray-700 bg-zinc-800/25 px-3 py-3.5 text-sm font-semibold text-gray-200 backdrop-blur-md backdrop-filter"
              >
                <div className="flex justify-end">
                  <Skeleton className="h-5 w-10" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }).map((_, idx) => (
              <tr key={idx}>
                <td className="whitespace-nowrap py-4 pl-3 sm:pr-3">
                  <div className="flex justify-end">
                    <Skeleton className="h-5 w-10" />
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4">
                  <Skeleton className="h-5 w-32" />
                </td>
                <td className="whitespace-nowrap px-3 py-4">
                  <div className="flex justify-end">
                    <Skeleton className="h-5 w-10" />
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4">
                  <div className="flex justify-end">
                    <Skeleton className="h-5 w-10" />
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4">
                  <div className="flex justify-end">
                    <Skeleton className="h-5 w-10" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-8 mt-24 text-center text-sm text-zinc-400">
        Last updated at <Skeleton className="inline-block h-5 w-24" />
      </div>
    </div>
  )
}

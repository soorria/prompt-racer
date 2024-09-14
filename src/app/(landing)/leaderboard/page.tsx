"use client"

import { useCallback, useMemo, useRef } from "react"

import LeaderboardHighlight from "~/components/leaderboard-screen/LeaderboardHighlight"
import { type Doc } from "~/lib/db/types"
import { api } from "~/lib/trpc/react"
import { cn } from "~/lib/utils"

export default function LeaderboardPage() {
  const observer = useRef<IntersectionObserver>()

  const infiniteLeaderboard = api.leaderboard.getLeaderboard.useInfiniteQuery(
    { limit: 10 },
    {
      getNextPageParam: (lastPage) => (lastPage.cursor !== null ? lastPage.cursor + 10 : undefined),
    },
  )

  const lastElementRef = useCallback(
    (node: HTMLTableRowElement) => {
      if (infiniteLeaderboard.isLoading) return

      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0]?.isIntersecting &&
          infiniteLeaderboard.hasNextPage &&
          !infiniteLeaderboard.isFetching
        ) {
          void infiniteLeaderboard.fetchNextPage()
        }
      })

      if (node) observer.current.observe(node)
    },
    [infiniteLeaderboard],
  )

  const players = useMemo(() => {
    return infiniteLeaderboard.data?.pages.reduce((acc, page) => {
      return [...acc, ...page.users]
    }, [] as Doc<"users">[])
  }, [infiniteLeaderboard])

  if (infiniteLeaderboard.isLoading || !players) return <h1>loading</h1>

  if (infiniteLeaderboard.error) return <h1>errroed</h1>

  return (
    <div>
      <LeaderboardHighlight players={[players[0], players[1], players[2]]} />
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
                  {players?.map((player, idx) => (
                    <tr key={player.id} ref={lastElementRef}>
                      <td
                        className={cn(
                          idx !== players.length - 1 ? "border-b border-gray-700/25" : "",
                          "whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-200 sm:pl-6 lg:pl-8",
                        )}
                      >
                        {idx + 1}
                      </td>
                      <td
                        className={cn(
                          idx !== players.length - 1 ? "border-b border-gray-700/25" : "",
                          "whitespace-nowrap px-3 py-4 text-sm text-gray-400",
                        )}
                      >
                        {player.name}
                      </td>
                      <td
                        className={cn(
                          idx !== players.length - 1 ? "border-b border-gray-700/25" : "",
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

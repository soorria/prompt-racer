"use client"

import type { RouterOutputs } from "~/lib/trpc/react"
import { api } from "~/lib/trpc/react"
import { InfiniteScrollTrigger } from "./InfiniteScrollTrigger"

type GameHistoryProps = {
  initialHistoryPage: RouterOutputs["games"]["getHistory"]
}

export function GameHistory(props: GameHistoryProps) {
  const gameHistory = api.games.getHistory.useInfiniteQuery(
    {},
    {
      getNextPageParam(lastPage) {
        return lastPage.nextCursor
      },
      initialData() {
        return {
          pages: [props.initialHistoryPage],
          pageParams: [props.initialHistoryPage.nextCursor],
        }
      },
    },
  )

  return (
    <div>
      <pre className="whitespace-pre-wrap">
        {JSON.stringify(gameHistory.data, null, 2)
          .split("\n")
          .map((line, i) => (
            <div key={i}>{line}</div>
          ))}
      </pre>

      {gameHistory.hasNextPage && (
        <InfiniteScrollTrigger
          onInView={() => {
            if (gameHistory.isLoading || !gameHistory.hasNextPage) {
              return
            }

            void gameHistory.fetchNextPage()
          }}
        />
      )}
    </div>
  )
}

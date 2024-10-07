"use client"

import Link from "next/link"
import { ArrowRight, Hash, Play } from "lucide-react"

import type { RouterOutputs } from "~/lib/trpc/react"
import { GAME_MODE_DETAILS } from "~/lib/games/constants"
import { MapfromDifficultyToBadgeVariant } from "~/lib/games/types"
import { api } from "~/lib/trpc/react"
import { cn } from "~/lib/utils"
import QuestionDifficultyBadge from "../QuestionDifficultyBadge"
import { Badge } from "../ui/badge"
import { InfiniteScrollTrigger } from "./InfiniteScrollTrigger"

type GameHistoryPage = RouterOutputs["games"]["getHistory"]
type GameHistoryItem = GameHistoryPage["items"][number]

type GameHistoryProps = {
  initialHistoryPage: GameHistoryPage
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

  const flattenedGameHistory = gameHistory.data?.pages.flatMap((page) => page.items) ?? []

  return (
    <div className="mx-auto max-w-screen-lg">
      <h1 className="mx-auto my-6 text-center text-4xl font-bold tracking-tight sm:my-14 sm:text-5xl">
        Game History
      </h1>

      <div className="mb-24 grid gap-6 md:grid-cols-2">
        {flattenedGameHistory.map((item) => {
          return <GameHistoryItem item={item} key={item.id} />
        })}
      </div>

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

function GameHistoryItem(props: { item: GameHistoryItem }) {
  const isGameFinished = props.item.status === "finished"

  const linkDetails = isGameFinished
    ? ({
        href: `/games/results/${props.item.id}`,
        label: "See results",
      } as const)
    : ({
        href: `/games/play/${props.item.id}`,
        label: "Back to game",
      } as const)

  return (
    <Link
      href={linkDetails.href}
      className="group/item flex cursor-pointer items-start gap-4 rounded bg-card p-4 transition-colors duration-500 hover:bg-card-lighter hover:duration-75 sm:px-6"
    >
      <span
        className={cn(
          "relative grid aspect-square w-8 shrink-0 place-items-center overflow-hidden rounded-full",
          {
            "bg-primary/70": !isGameFinished || true,
          },
        )}
      >
        {isGameFinished ? (
          <>{props.item.finalResult?.position ?? <>dnf</>}</>
        ) : (
          <Play className="sq-4" />
        )}
        <Hash className="absolute -left-2 -top-3 opacity-10 sq-12" />
      </span>

      <span className="flex flex-1 flex-col">
        <span className="flex w-full items-end justify-between">
          <span>{GAME_MODE_DETAILS[props.item.mode].title}</span>

          <span className="mb-px inline-block text-sm text-zinc-500">
            {props.item.finalResult?.score}
            {GAME_MODE_DETAILS[props.item.mode].unitShort}
          </span>
        </span>

        {props.item.difficulty && (
          <QuestionDifficultyBadge difficulty={props.item.difficulty} className="mb-2 text-xs" />
        )}

        <span className="flex items-center gap-1 text-sm group-hover/item:underline">
          {linkDetails.label}
          <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-500 group-hover/item:-rotate-45 group-hover/item:duration-75" />
        </span>
      </span>
    </Link>
  )
}

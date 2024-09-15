import { Suspense } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { redirect } from "next/navigation"

import type { LeaderboardOrdering } from "~/lib/leaderboard/trpc"
import LeaderboardHighlight, {
  ORDERING_DETAILS,
} from "~/components/leaderboard-screen/LeaderboardHighlight"
import { LazyLeaderboardWinnerConfetti } from "~/components/leaderboard-screen/LeaderboardWinnerConfetti.lazy"
import LocalDate from "~/components/LocalDate"
import UserAvatar from "~/components/nav-bar/UserAvatar"
import { getAuthUser } from "~/lib/auth/user"
import { type Doc } from "~/lib/db/types"
import { leaderboardOrderingSchema } from "~/lib/leaderboard/trpc"
import { api } from "~/lib/trpc/server"
import { cn } from "~/lib/utils"

export const revalidate = 60

async function Confetti(props: { leaderUserId: string | undefined }) {
  const currentUser = await getAuthUser()
  const currentUserIsLeader = Boolean(
    props.leaderUserId && currentUser && props.leaderUserId === currentUser.id,
  )

  return currentUserIsLeader ? <LazyLeaderboardWinnerConfetti /> : null
}

export default async function LeaderboardPage(props: {
  params: {
    ordering?: string
  }
}) {
  const ordering = resolveOrderingOrRedirect(props.params.ordering)

  const leaderboard = await api.leaderboard.getLeaderboard({
    ordering: ordering,
  })

  const TABS: { title: string; ordering: LeaderboardOrdering }[] = [
    {
      title: ORDERING_DETAILS.wins.label,
      ordering: "wins",
    },
    {
      title: ORDERING_DETAILS["win-rate"].label,
      ordering: "win-rate",
    },
    {
      title: ORDERING_DETAILS["games-played"].label,
      ordering: "games-played",
    },
  ]

  return (
    <div className="mx-auto max-w-screen-lg">
      <h1 className="my-16 text-center text-5xl font-bold tracking-tight sm:text-4xl">
        Leaderboard
      </h1>

      <Suspense>
        <Confetti leaderUserId={leaderboard[0]?.id} />
      </Suspense>

      <div className="flex justify-center gap-2 sm:my-24">
        {TABS.map((tab, index) => (
          <Link
            key={index}
            data-id={tab.ordering}
            type="button"
            className={cn(
              "inline-flex w-fit items-center justify-center px-2 text-center transition-all hover:underline active:scale-[0.98]",
              {
                "text-zinc-50/50": tab.ordering !== ordering,
                "text-white underline": tab.ordering === ordering,
              },
            )}
            href={`/leaderboard/${tab.ordering}`}
          >
            {tab.title}
          </Link>
        ))}
      </div>

      <LeaderboardHighlight players={leaderboard.slice(0, 3)} ordering={ordering} />

      {leaderboard.length ? <LeaderboardTable users={leaderboard} /> : null}

      <div className="mb-8 mt-24 text-center text-sm text-zinc-400">
        Last updated at <LocalDate date={new Date()} />
      </div>
    </div>
  )
}

const positionRowClasses = {
  0: {
    row: "hover:bg-yellow-700/25",
    rankCell: "group-hover/row:text-yellow-400",
  },
  1: {
    row: "hover:bg-gray-600/25",
    rankCell: "group-hover/row:text-gray-300",
  },
  2: {
    row: "hover:bg-orange-900/25",
    rankCell: "group-hover/row:text-orange-400",
  },
  "3+": {
    row: "hover:bg-zinc-800/25",
    rankCell: "",
  },
} satisfies Record<
  PropertyKey,
  {
    row: string
    rankCell: string
  }
>

function getPositionClassKey(position: number): keyof typeof positionRowClasses {
  if (position <= 2) {
    return position as keyof typeof positionRowClasses
  }
  return "3+"
}

function LeaderboardTable({ users }: { users: Doc<"users">[] }) {
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
          className="slide-in"
          style={{
            "--initial-step": 4,
          }}
        >
          {users.map((player, idx) => {
            const isNotLastRow = idx !== users.length - 1

            const classes = positionRowClasses[getPositionClassKey(idx)]

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
                    { "border-b border-gray-700/25": isNotLastRow },
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
                ].map(({ value, align }, valueIdx) => {
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

function LeaderboardTablePlayerName({ player }: { player: Doc<"users"> }) {
  const commonClasses = {
    root: "flex items-center gap-1.5",
  }
  const classes = {
    ...(player.github_username
      ? {
          text: "group-hover/link:text-white underline transition",
        }
      : {}),
    ...commonClasses,
  }

  const children = (
    <>
      <UserAvatar key="img" imageUrl={player.profile_image_url} name={player.name} size="xs" />
      <span className={classes.text}>{player.name}</span>
    </>
  )

  if (!player.github_username) {
    return <span className={classes.root}>{children}</span>
  }

  return (
    <a
      href={`https://github.com/${player.github_username}`}
      rel="noopener noreferrer"
      target="_blank"
      className={cn(classes.root, "group/link")}
    >
      {children}
    </a>
  )
}

function resolveOrderingOrRedirect(ordering: string | undefined) {
  const parseResult = leaderboardOrderingSchema.safeParse(ordering ?? "wins")

  if (!parseResult.success) {
    return redirect("/leaderboard/wins")
  }

  return parseResult.data
}

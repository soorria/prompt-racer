import Link from "next/link"
import { redirect } from "next/navigation"

import type { LeaderboardOrdering } from "~/lib/leaderboard/trpc"
import LeaderboardHighlight, {
  ORDERING_DETAILS,
} from "~/components/leaderboard-screen/LeaderboardHighlight"
import LocalDate from "~/components/LocalDate"
import UserAvatar from "~/components/nav-bar/UserAvatar"
import { type Doc } from "~/lib/db/types"
import { leaderboardOrderingSchema } from "~/lib/leaderboard/trpc"
import { api } from "~/lib/trpc/server"
import { cn } from "~/lib/utils"

export const revalidate = 60

export default async function LeaderboardPage(props: {
  params: {
    ordering?: string
  }
}) {
  const parseResult = leaderboardOrderingSchema.safeParse(props.params.ordering)

  if (!parseResult.success) {
    return redirect("/leaderboard/wins")
  }

  const ordering = parseResult.data

  const users = await api.leaderboard.getLeaderboard({
    ordering: parseResult.data,
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
    <div>
      <h1 className="my-16 text-center text-5xl font-bold tracking-tight sm:text-4xl">
        Leaderboard
      </h1>

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

      <LeaderboardHighlight players={users.slice(0, 3)} ordering={ordering} />

      {users.length ? <LeaderboardTable users={users} /> : null}

      <div className="mb-8 mt-24 text-center text-sm text-zinc-400">
        Last updated at <LocalDate date={new Date()} />
      </div>
    </div>
  )
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
              className="sticky top-0 z-10 rounded-tl-xl border-b border-gray-700 bg-zinc-800 bg-opacity-25 px-3 py-3.5 text-left text-sm font-semibold text-gray-200 backdrop-blur-md backdrop-filter"
            >
              Rank
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

            return (
              <tr
                key={player.id}
                style={{
                  "--step-num": idx.toString(),
                }}
                className="transition-colors duration-500 hover:bg-zinc-800/25 hover:duration-75"
              >
                <td
                  className={cn(
                    { "border-b border-gray-700/25": isNotLastRow },
                    "whitespace-nowrap py-4 pl-3 text-sm font-medium text-gray-200",
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
                        "whitespace-nowrap px-3 py-4 text-sm tabular-nums text-gray-400",
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
      className={cn(classes.root, "group/link")}
    >
      {children}
    </a>
  )
}

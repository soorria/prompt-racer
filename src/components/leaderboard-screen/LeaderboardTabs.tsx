import Link from "next/link"

import { type LeaderboardOrdering } from "~/lib/leaderboard/queries"
import { cn } from "~/lib/utils"
import { ORDERING_DETAILS } from "./LeaderboardHighlight"

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

export function LeaderboardTabs({ ordering }: { ordering: LeaderboardOrdering }) {
  return (
    <nav aria-label="Tabs" className="flex space-x-4">
      {TABS.map((tab) => (
        <Link
          key={tab.ordering}
          href={`/leaderboard/${tab.ordering}`}
          aria-current={tab.ordering === ordering ? "page" : undefined}
          className={cn(
            tab.ordering === ordering ? "bg-primary text-white" : "text-gray-400 hover:text-white",
            "rounded-md px-3 py-2 text-sm font-medium transition-all",
          )}
        >
          {tab.title}
        </Link>
      ))}
    </nav>
  )
}

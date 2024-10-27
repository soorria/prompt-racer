"use client"

import Link from "next/link"
import { motion } from "framer-motion"

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
            "relative rounded-md px-3 py-2 text-sm font-medium text-gray-400 transition-all hover:text-white",
          )}
        >
          <motion.span
            className={cn(
              { "text-white": tab.ordering === ordering },
              "relative z-10 transition-all",
            )}
          >
            {tab.title}
          </motion.span>
          {tab.ordering === ordering && (
            <motion.span
              layoutId="highlight"
              className="absolute inset-0 z-0 block w-full rounded-lg bg-primary"
            />
          )}
        </Link>
      ))}
    </nav>
  )
}

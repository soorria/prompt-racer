import type { SQL } from "drizzle-orm"
import { unstable_cache } from "next/cache"
import { z } from "zod"

import { db, orderBy, schema } from "../db"

export const leaderboardOrderingSchema = z.enum(["wins", "games-played", "win-rate"])
export type LeaderboardOrdering = z.infer<typeof leaderboardOrderingSchema>

async function getGlobalLeaderboardImpl(ordering: LeaderboardOrdering) {
  const orderByMap: Record<LeaderboardOrdering, SQL[]> = {
    wins: [
      orderBy.desc(schema.users.wins),
      orderBy.asc(schema.users.gamesPlayed),
      orderBy.desc(schema.users.inserted_at),
    ],
    "games-played": [
      orderBy.desc(schema.users.gamesPlayed),
      orderBy.desc(schema.users.inserted_at),
    ],
    // TODO: maybe set a lower limit for gamesPlayed to be considered for this ordering
    "win-rate": [
      orderBy.desc(schema.users.winRate),
      orderBy.desc(schema.users.wins),
      orderBy.desc(schema.users.inserted_at),
    ],
  }

  const users = await db.query.users.findMany({
    orderBy: orderByMap[ordering],
    limit: 100,
  })
  return users
}

export const getGlobalLeaderboard = unstable_cache(
  async (ordering: LeaderboardOrdering) => {
    return {
      leaderboard: await getGlobalLeaderboardImpl(ordering),
      updatedAt: new Date(),
    }
  },
  ["leaderboard"],
  {
    revalidate: 10,
  },
)

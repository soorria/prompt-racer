import { fetchQuery } from "convex/nextjs"
import { clerkClient } from "@clerk/nextjs"
import { api } from "~convex/api"

export const revalidate = 60

const GlobalLeaderboardPage = async () => {
  const leaderboardUsers = (await fetchQuery(api.users.getLeaderboardPlayers)).map((player) => ({
    ...player,
    clerkUserId: player.userId.split("|")[1] ?? "",
  }))
  const clerkUserIds = leaderboardUsers.map((player) => {
    return player.clerkUserId
  })

  const users = await clerkClient.users.getUserList({
    userId: clerkUserIds,
  })
  const usersById = Object.fromEntries(users.map((u) => [u.id, u]))

  const leaderboard = leaderboardUsers.map((player) => {
    const user = usersById[player.clerkUserId]!
    const name =
      [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || "Deleted User"

    return {
      ...player,
      user,
      name,
    }
  })

  return (
    <div className="pt-12">
      <h1 className="text-5xl text-center font-medium mb-8">Global leaderboard</h1>

      <ul className="w-full max-w-screen-lg px-4 mx-auto space-y-4">
        {leaderboard.map((player) => {
          return (
            <li key={player.clerkUserId} className="bg-card rounded px-8 py-6">
              {player.name} {player.rating}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default GlobalLeaderboardPage

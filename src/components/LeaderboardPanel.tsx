import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { InferQueryOutput } from "~/lib/convex"
import { api } from "~convex/api"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { Hash, Minus } from "lucide-react"

type Props = {
  users: NonNullable<InferQueryOutput<typeof api.games.getGameInfoForUser>["game"]>["players"]
}

const LeaderboardPanel: React.FC<Props> = ({ users }) => {
  const [animateRef] = useAutoAnimate()
  const sortedUsers = users
    ? [...users].sort((a, b) => {
        const positionA = a.position === "nah" || a.position === undefined ? Infinity : a.position
        const positionB = b.position === "nah" || b.position === undefined ? Infinity : b.position
        return positionA - positionB
      })
    : []

  return (
    <div ref={animateRef} className="">
      <h1 className="text-2xl font-bold mb-6">Live Leaderboard</h1>
      {sortedUsers.map((user, idx) => (
        <div key={user.userId} className="flex items-center mb-3">
          <div className="text-lg text-gray-500 mr-3">
            {user.position ? (
              <div className="flex items-center">
                <Hash className="h-5 w-5" />
                {`${+user.position + 1}`}
              </div>
            ) : (
              <Minus className="h-6 w-6" />
            )}
          </div>
          <Avatar className="mr-3 w-7 h-7">
            {user.profilePictureUrl ? (
              <AvatarImage src={user.profilePictureUrl} alt={user.name} />
            ) : (
              <AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <div className="text-zinc-300">{user.name}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default LeaderboardPanel

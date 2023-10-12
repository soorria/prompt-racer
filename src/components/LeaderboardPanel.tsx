import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { InferQueryOutput } from "~/lib/convex"
import { api } from "~convex/api"

type Props = {
  users: NonNullable<InferQueryOutput<typeof api.games.getGameInfoForUser>["game"]>["players"]
}

const LeaderboardPanel: React.FC<Props> = ({ users }) => {
  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-6">Players</h1>
      {users?.map((user, idx) => (
        <div key={idx} className="flex items-center mb-3">
          <Avatar className="mr-3">
            {user.profilePictureUrl ? (
              <AvatarImage src={user.profilePictureUrl} alt={user.name} />
            ) : (
              <AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <div className="text-zinc-300">{user.name}</div>
          </div>
          {/* <div className="text-sm text-gray-500">{user.timeToFinish}s</div> */}
        </div>
      ))}
    </div>
  )
}

export default LeaderboardPanel

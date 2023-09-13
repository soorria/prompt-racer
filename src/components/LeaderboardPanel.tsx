import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

type Props = {
  users?: Array<{ name: string; avatarUrl?: string; fallbackText?: string; timeToFinish: number }>
}

const LeaderboardPanel: React.FC<Props> = ({ users = sampleUsers }) => {
  return (
    <div className="p-4 bg-card h-full rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-4">Leaderboard</h1>
      {users.map((user, idx) => (
        <div key={idx} className="flex items-center mb-3">
          <div className="w-8 text-right pr-2">{idx + 1}.</div>
          <Avatar className="mr-3">
            {user.avatarUrl ? (
              <AvatarImage src={user.avatarUrl} alt={user.name} />
            ) : (
              <AvatarFallback>{user.fallbackText}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <div className="text-zinc-300">{user.name}</div>
          </div>
          <div className="text-sm text-gray-500">{user.timeToFinish}s</div>
        </div>
      ))}
    </div>
  )
}

const sampleUsers = [
  {
    name: "Shadcn",
    avatarUrl: "http://localhost:3000/chatbot-avatars/openAIBlue.webp",
    timeToFinish: 10,
  },
  {
    name: "CM",
    fallbackText: "CM",
    timeToFinish: 12,
  },
]

export default LeaderboardPanel

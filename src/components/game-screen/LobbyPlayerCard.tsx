import React from "react"
import { type User } from "@supabase/supabase-js"

import { type InGameState } from "~/lib/games/types"
import UserAvatar from "../nav-bar/UserAvatar"

type Props = {
  user: User
  players: InGameState["players"]
  onLeaveGame: () => void
}

export default function LobbyPlayerCard({ players, user }: Props) {
  const me = players.find((p) => p.user.id === user.id)
  const otherPlayers = players.filter((p) => p.user.id !== user.id)
  const ordered = [me, ...otherPlayers].filter(Boolean)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {ordered.map((person, idx) => (
        <div
          key={idx}
          className="relative flex items-center gap-3 rounded-lg border border-gray-700 bg-card px-6 py-5 shadow-sm"
        >
          <div className="flex-shrink-0">
            <UserAvatar imageUrl={person.user.profile_image_url} name={person.user.name} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{person.user.name}</p>
            <p className="text-xs text-gray-500">{person.user.wins} wins</p>
          </div>

          {/* TODO: fix leaving */}
          {/* {currentUser?.userId === person.userId && (
            <Button variant="destructive" size="sm" onClick={onLeaveGame}>
              Leave
            </Button>
          )} */}
        </div>
      ))}
      {/* Skeleton card */}
      <div className="relative flex items-center space-x-3 rounded-lg border border-gray-700 bg-card px-6 py-5 shadow-sm">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 animate-pulse rounded-full bg-zinc-600"></div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="h-4 w-1/2 animate-pulse rounded-lg bg-zinc-600"></div>
        </div>
      </div>
    </div>
  )
}

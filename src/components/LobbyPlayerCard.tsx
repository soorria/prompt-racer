import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Doc } from "~convex/dataModel"

type Props = {
  players: NonNullable<Doc<"game">["players"]>
}

export default function LobbyPlayerCard({ players }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {players.map((person, idx) => (
        <div
          key={idx}
          className="relative flex items-center space-x-3 rounded-lg border border-gray-700 bg-card px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
        >
          <div className="flex-shrink-0">
            <Avatar>
              <AvatarImage src={person.profilePictureUrl} />
              <AvatarFallback>
                {person.name.startsWith("Anonymous #") ? "A" : person.name[0]}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="min-w-0 flex-1">
            <a href="#" className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium">{person?.name}</p>
            </a>
          </div>
        </div>
      ))}
      {/* Skeleton card */}
      <div className="relative flex items-center space-x-3 rounded-lg border border-gray-700 bg-card px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 bg-zinc-600 rounded-lg animate-pulse"></div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="h-4 w-1/2 bg-zinc-600 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

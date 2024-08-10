import type { User } from "@supabase/supabase-js"
import React from "react"
import { UserRound } from "lucide-react"

import { cn } from "~/lib/utils"

type Props = {
  user: User | null
}

export default function UserAvatar({ user }: Props) {
  const lineClasses = cn(
    "absolute rotate-45 bg-white/70 transition-all duration-300",
    "h-12 w-3 -translate-x-2 -translate-y-6 group-hover:translate-x-9 group-hover:translate-y-3",
  )

  return (
    <div
      className={cn("group relative overflow-hidden rounded-full transition-all hover:shadow-xl", {
        user: "hover:scale-105",
      })}
    >
      {user && <div className={lineClasses}></div>}
      {user && typeof user.user_metadata.avatar_url === "string" ? (
        // don't care about optimal images for the profile image
        // eslint-disable-next-line @next/next/no-img-element
        <img src={user.user_metadata.avatar_url} alt="avatar" className="h-8 w-8 rounded-full" />
      ) : (
        <div className="grid h-8 w-8 place-items-center rounded-full bg-gray-200">
          <UserRound className="mt-1 h-8 w-8 stroke-zinc-400" />
        </div>
      )}
    </div>
  )
}

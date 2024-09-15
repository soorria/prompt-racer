import React from "react"
import { UserRound } from "lucide-react"

import { cn } from "~/lib/utils"

export default function UserAvatar({
  imageUrl,
  size = "sm",
}: {
  imageUrl?: string | null
  size?: "sm" | "md" | "lg"
}) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-16 w-16",
    lg: "h-20 w-20",
  }

  // Fancy line animation classes
  const lineClasses = cn("absolute rotate-45 bg-white/70 blur-sm transition-all duration-300", {
    "h-12 w-3 -translate-x-2 -translate-y-6 group-hover:translate-x-9 group-hover:translate-y-3":
      size === "sm",
    "h-20 w-4 -translate-x-4 -translate-y-12 group-hover:translate-x-16 group-hover:translate-y-5":
      size === "md",
    "h-28 w-4 -translate-x-2 -translate-y-14 group-hover:translate-x-28 group-hover:translate-y-5":
      size === "lg",
  })

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-full transition-all hover:scale-105 hover:shadow-xl",
      )}
    >
      {imageUrl && <div className={lineClasses}></div>}
      {imageUrl ? (
        // Render image avatar
        // Ignoring eslint rule for using next/image
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="avatar" className={cn("rounded-full", sizeClasses[size])} />
      ) : (
        // Render default avatar when no imageUrl is provided
        <div className={cn("grid place-items-center rounded-full bg-gray-200", sizeClasses[size])}>
          <UserRound className={cn("stroke-zinc-400", sizeClasses[size])} />
        </div>
      )}
    </div>
  )
}

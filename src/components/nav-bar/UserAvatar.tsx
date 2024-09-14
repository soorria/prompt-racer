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
  const lineClasses = cn("absolute rotate-45 bg-white/70 blur-sm transition-all duration-300", "", {
    "h-12 w-3 -translate-x-2 -translate-y-6 group-hover:translate-x-9 group-hover:translate-y-3":
      size === "sm",
    "h-20 w-4 -translate-x-4 -translate-y-12 group-hover:translate-x-16 group-hover:translate-y-5":
      size === "md",
    "h-28 w-4 -translate-x-2 -translate-y-14 group-hover:translate-x-28 group-hover:translate-y-5":
      size === "lg",
  })

  return (
    <div
      className={cn("group relative overflow-hidden rounded-full transition-all hover:shadow-xl", {
        user: "hover:scale-105",
      })}
    >
      {imageUrl && <div className={lineClasses}></div>}
      {imageUrl ? (
        // don't care about optimal images for the profile image
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt="avatar"
          className={cn("rounded-full", {
            "h-6 w-6": size === "sm",
            "h-16 w-16": size === "md",
            "h-20 w-20": size === "lg",
          })}
        />
      ) : (
        <div
          className={cn("grid place-items-center rounded-full bg-gray-200", {
            "h-8 w-8": size === "sm",
            "h-16 w-16": size === "md",
            "h-20 w-20": size === "lg",
          })}
        >
          <UserRound
            className={cn("mt-1 stroke-zinc-400", {
              "h-8 w-8": size === "sm",
              "h-16 w-16": size === "md",
              "h-20 w-20": size === "lg",
            })}
          />
        </div>
      )}
    </div>
  )
}

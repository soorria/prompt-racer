import React from "react"
import BoringAvatar from "boring-avatars"

import { cn } from "~/lib/utils"
import { DRACULA_COLORS } from "../../lib/colors/constants"
import { Avatar, AvatarImage } from "../ui/avatar"

/**
 * This is to hide the extremely noisy warning that defaultProps
 * is deprecated
 */
if ("defaultProps" in BoringAvatar) {
  delete BoringAvatar.defaultProps
}

type UserAvatarSize = "xs" | "sm" | "md" | "lg"

export default function UserAvatar({
  name = "Anonymous",
  imageUrl,
  size = "sm",
  className,
}: {
  name: string | undefined
  imageUrl: string | undefined | null
  size?: UserAvatarSize
  className?: string
}) {
  const sizeClasses: Record<UserAvatarSize, string> = {
    xs: "sq-4",
    sm: "sq-6",
    md: "sq-16",
    lg: "sq-20",
  }

  // Fancy line animation classes
  const lineClasses = cn(
    "absolute left-0 top-0 rotate-45 bg-white/70 blur-sm transition-transform duration-300",
    {
      "h-12 w-3 -translate-x-2 -translate-y-6 group-hover:translate-x-9 group-hover:translate-y-3":
        size === "sm",
      "h-20 w-4 -translate-x-4 -translate-y-12 group-hover:translate-x-16 group-hover:translate-y-5":
        size === "md",
      "h-32 w-4 -translate-x-2 -translate-y-14 group-hover:translate-x-28 group-hover:translate-y-5":
        size === "lg",
      hidden: size === "xs",
    },
  )

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-full transition-transform hover:shadow-xl",
        className,
      )}
    >
      <Avatar className={cn("rounded-full", sizeClasses[size])}>
        {/**
         * Note: intentionally not rendering the fallback inside the AvatarFallback
         * component so the actual image can fade in :)
         */}
        <BoringAvatar
          name={name}
          variant="beam"
          colors={DRACULA_COLORS}
          className="absolute inset-0"
        />

        <AvatarImage
          src={imageUrl ?? undefined}
          alt={`${name}'s avatar`}
          className={"relative animate-in fade-in group-hover:scale-105"}
        />
      </Avatar>
      <div className={lineClasses}></div>
    </div>
  )
}

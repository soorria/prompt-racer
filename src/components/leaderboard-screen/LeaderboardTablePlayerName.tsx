import type { Doc } from "~/lib/db/types"
import { cn } from "~/lib/utils"
import UserAvatar from "../nav-bar/UserAvatar"

export default function LeaderboardTablePlayerName({ player }: { player: Doc<"userProfiles"> }) {
  const commonClasses = {
    root: "inline-flex items-center gap-1.5",
  }
  const classes = {
    ...(player.github_username
      ? {
          text: "group-hover/link:text-white underline transition",
        }
      : {}),
    ...commonClasses,
  }

  const children = (
    <>
      <UserAvatar key="img" imageUrl={player.profile_image_url} name={player.name} size="xs" />
      <span className={classes.text}>{player.name}</span>
    </>
  )

  if (!player.github_username) {
    return <span className={classes.root}>{children}</span>
  }

  return (
    <a
      href={`https://github.com/${player.github_username}`}
      rel="noopener noreferrer"
      target="_blank"
      className={cn(classes.root, "group/link")}
    >
      {children}
    </a>
  )
}

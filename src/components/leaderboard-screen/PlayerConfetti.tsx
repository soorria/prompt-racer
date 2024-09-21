/**
 * unfortunately, ppr is experimental and doesn't work for me
 * so for any consumer to still be cacheable, this needs to be client-side only
 */

"use client"

import { useSupabaseUser } from "~/lib/auth/hooks/use-supabase-user"
import { LazyLeaderboardWinnerConfetti } from "./LeaderboardWinnerConfetti.lazy"

export function PlayerConfetti(props: { leaderUserId: string | undefined }) {
  const currentUser = useSupabaseUser()

  const currentUserIsLeader = Boolean(
    props.leaderUserId && props.leaderUserId === currentUser.data?.id,
  )
  return currentUserIsLeader ? <LazyLeaderboardWinnerConfetti /> : null
}

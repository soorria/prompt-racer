import { getAuthUser } from "~/lib/auth/user"
import { LazyLeaderboardWinnerConfetti } from "./LeaderboardWinnerConfetti.lazy"

export async function Confetti(props: { leaderUserId: string | undefined }) {
  const currentUser = await getAuthUser()
  const currentUserIsLeader = Boolean(
    props.leaderUserId && currentUser && props.leaderUserId === currentUser.id,
  )

  return currentUserIsLeader ? <LazyLeaderboardWinnerConfetti /> : null
}

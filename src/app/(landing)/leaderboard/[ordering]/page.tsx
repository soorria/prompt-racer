import { ORDERING_DETAILS } from "~/components/leaderboard-screen/LeaderboardHighlight"

export { default, revalidate } from "../page"

export function generateStaticParams() {
  return Object.keys(ORDERING_DETAILS).map((key) => ({
    ordering: key,
  }))
}

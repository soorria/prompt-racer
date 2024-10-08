import { type BadgeProps } from "~/components/ui/badge"
import { type Doc } from "../db/types"
import { type getSessionInfoForPlayer } from "./queries"

type FullGameState = Doc<"gameStates"> & {
  question: Doc<"questions"> & {
    testCases: Doc<"questionTestCases">[]
  }
  players: {
    user: Doc<"userProfiles">
  }[]
}

export type WaitingForPlayersGameState = Omit<FullGameState, "status" | "question"> & {
  status: "waitingForPlayers"
  question?: null | undefined
}
export type NotWaitingForPlayersGameState = Omit<FullGameState, "status"> & {
  status: Exclude<Doc<"gameStates">["status"], "waitingForPlayers">
}

export type InGameState = WaitingForPlayersGameState | NotWaitingForPlayersGameState
export type QuestionWithTestCases = FullGameState["question"]

export type PlayerGameSession = NonNullable<Awaited<ReturnType<typeof getSessionInfoForPlayer>>>

export type FinalPlayerResult = Pick<Doc<"playerGameSessionFinalResults">, "position" | "score">

export const MapfromDifficultyToBadgeVariant = {
  easy: "green",
  medium: "yellow",
  hard: "red",
} satisfies Record<Doc<"questions">["difficulty"], NonNullable<BadgeProps["variant"]>>

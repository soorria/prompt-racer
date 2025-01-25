import { type BadgeProps } from "~/components/ui/badge"
import { type Doc } from "../db/types"
import { type getSessionInfoForPlayer } from "./queries"

type FullGameState = Omit<Doc<"gameStates">, "question_id"> & {
  question: Doc<"questions"> & {
    programmingQuestion: Doc<"programmingQuestions"> & {
      testCases: Doc<"programmingQuestionTestCases">[]
    }
  }
  players: {
    user: Pick<Doc<"userProfiles">, "id" | "name" | "profile_image_url" | "wins">
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

export const DifficultyToBadgeVariantMap = {
  easy: "green",
  medium: "yellow",
  hard: "red",
} satisfies Record<Doc<"questions">["difficulty"], NonNullable<BadgeProps["variant"]>>

export type ClientGameState = {
  gameState: InGameState
  gameSession: PlayerGameSession
}

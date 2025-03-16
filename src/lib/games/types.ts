import { type BadgeProps } from "~/components/ui/badge"
import { type Doc } from "../db/types"
import { type getSessionInfoForPlayer } from "./queries"

export type FullQuestion = Doc<"questions"> &
  (
    | {
        programming_question_id: string
        programmingQuestion: Doc<"programmingQuestions"> & {
          testCases: Doc<"programmingQuestionTestCases">[]
        }
        picture_question_id: null
        pictureQuestion: null
      }
    | {
        picture_question_id: string
        pictureQuestion: Doc<"pictureQuestions">
        programming_question_id: null
        programmingQuestion: null
      }
  )

type FullGameState = Omit<Doc<"gameStates">, "question_id"> & {
  question: FullQuestion
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
export type ProgrammingQuestionWithTestCases = FullGameState["question"] & {
  programmingQuestion: Doc<"programmingQuestions"> & {
    testCases: Doc<"programmingQuestionTestCases">[]
  }
}
export type PictureQuestion = FullGameState["question"] & {
  pictureQuestion: Doc<"pictureQuestions">
}
export type QuestionTestState = NonNullable<
  NonNullable<Awaited<ReturnType<typeof getSessionInfoForPlayer>>>["testState"]
>
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

export type ProgrammingSubmissionState = {
  type: "programming"
  submission_state_id: string
  metrics: { numPassingSubmissionsTestCases: number; numTestCases: number }
}

type PictureSubmissionState = {
  type: "picture"
  submission_state_id: string
  metrics: { match_percentage: number }
}

export type SubmissionState = ProgrammingSubmissionState | PictureSubmissionState

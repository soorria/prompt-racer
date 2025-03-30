import { type DBOrTransaction, type Doc } from "~/lib/db/types"
import { type QuestionDifficultyLevel } from "../constants"
import { BaseQuestionStrategy } from "./base"

export type QuestionWithTypeDetails = Doc<"questions"> & {
  programmingQuestion: Doc<"programmingQuestions"> | null
  pictureQuestion: Doc<"pictureQuestions"> | null
}

export abstract class ServerQuestionStrategy extends BaseQuestionStrategy {
  abstract getOrGenerateQuestion(
    tx: DBOrTransaction,
    options: {
      difficulty?: QuestionDifficultyLevel
    },
  ): Promise<QuestionWithTypeDetails>

  abstract getStarterCode(question: QuestionWithTypeDetails): string
}

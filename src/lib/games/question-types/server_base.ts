import { type DBOrTransaction, type Doc } from "~/lib/db/types"
import { type QuestionDifficultyLevels } from "../constants"
import { BaseQuestionStrategy } from "./base"

export abstract class ServerQuestionStrategy extends BaseQuestionStrategy {
  abstract getOrGenerateQuestion(
    tx: DBOrTransaction,
    options: {
      difficulty?: QuestionDifficultyLevels
    },
  ): Promise<
    Doc<"questions"> & {
      programmingQuestion: Doc<"programmingQuestions"> | null
      pictureQuestion: Doc<"pictureQuestions"> | null
    }
  >
}

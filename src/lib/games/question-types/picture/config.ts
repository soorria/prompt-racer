import { QuestionTypeConfig } from "../base"

export class PictureQuestionConfig extends QuestionTypeConfig {
  readonly supportedModeIds = [
    "fastest-player",
    "shortest-code",
    "fewest-characters-to-llm",
  ] as const

  isCompatibleQuestion(question: {
    programmingQuestion: object | null
    pictureQuestion: object | null
  }): boolean {
    return question.pictureQuestion !== null
  }
}

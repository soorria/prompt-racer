import { QuestionTypeConfig } from "../base"

export class ProgrammingQuestionConfig extends QuestionTypeConfig {
  readonly supportedModeIds = [
    "fastest-player",
    "fastest-code",
    "shortest-code",
    "fewest-characters-to-llm",
  ] as const

  isCompatibleQuestion(question: {
    programmingQuestion: object | null
    pictureQuestion: object | null
  }): boolean {
    return question.programmingQuestion !== null
  }
}

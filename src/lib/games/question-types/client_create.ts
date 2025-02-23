import type { QuestionType } from "../constants"
import type { ClientQuestionStrategy } from "./base"
import { type FullQuestion } from "../types"
import { PictureQuestionStrategy } from "./picture/client"
import { ProgrammingQuestionStrategy } from "./programming/client"

export function createClientQuestionStrategy(
  type: QuestionType,
  question: FullQuestion | null | undefined,
): ClientQuestionStrategy {
  if (!question) {
    throw new Error("Question is null or undefined")
  }

  switch (type) {
    case "programming":
      return new ProgrammingQuestionStrategy(question)
    case "picture":
      return new PictureQuestionStrategy(question)
    default:
      throw new Error(`Unknown question type`)
  }
}

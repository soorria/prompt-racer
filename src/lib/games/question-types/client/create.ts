import type { QuestionType } from "../../constants"
import type { ClientQuestionStrategy } from "../base"
import { PictureQuestionStrategy } from "./picture"
import { ProgrammingQuestionStrategy } from "./programming"

export function getClientQuestionStrategy(type: QuestionType): ClientQuestionStrategy {
  switch (type) {
    case "programming":
      return new ProgrammingQuestionStrategy()
    case "picture":
      return new PictureQuestionStrategy()
    default:
      throw new Error(`Unknown question type`)
  }
}

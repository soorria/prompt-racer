import type { QuestionType } from "../../constants"
import type { ServerQuestionStrategy } from "../base"
import { ServerPictureStrategy } from "./picture"
import { ServerProgrammingStrategy } from "./programming"

export function getServerQuestionStrategy(type: QuestionType): ServerQuestionStrategy {
  switch (type) {
    case "programming":
      return new ServerProgrammingStrategy()
    case "picture":
      return new ServerPictureStrategy()
    default:
      throw new Error(`Unknown question type`)
  }
}

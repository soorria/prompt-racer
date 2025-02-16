import type { QuestionType } from "../constants"
import type { ClientQuestionStrategy, ServerQuestionStrategy } from "./base"
import { PictureQuestionStrategy } from "./picture/client"
import { ServerPictureStrategy } from "./picture/server"
import { ProgrammingQuestionStrategy } from "./programming/client"
import { ServerProgrammingStrategy } from "./programming/server"

export function createClientQuestionStrategy(type: QuestionType): ClientQuestionStrategy {
  switch (type) {
    case "programming":
      return new ProgrammingQuestionStrategy()
    case "picture":
      return new PictureQuestionStrategy()
    default:
      throw new Error(`Unknown question type`)
  }
}

export function createServerQuestionStrategy(type: QuestionType): ServerQuestionStrategy {
  switch (type) {
    case "programming":
      return new ServerProgrammingStrategy()
    case "picture":
      return new ServerPictureStrategy()
    default:
      throw new Error(`Unknown question type`)
  }
}

import "server-only"

import type { QuestionType } from "../constants"
import { ServerPictureStrategy } from "./picture/server"
import { ServerProgrammingStrategy } from "./programming/server"
import { type ServerQuestionStrategy } from "./server_base"

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

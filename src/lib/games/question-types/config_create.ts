import { type QuestionType } from "../constants"
import { type QuestionTypeConfig } from "./base"
import { PictureQuestionConfig } from "./picture/config"
import { ProgrammingQuestionConfig } from "./programming/config"

export function getQuestionConfig(type: QuestionType): QuestionTypeConfig {
  switch (type) {
    case "programming":
      return new ProgrammingQuestionConfig()
    case "picture":
      return new PictureQuestionConfig()
    default:
      throw new Error(`Unknown question type`)
  }
}

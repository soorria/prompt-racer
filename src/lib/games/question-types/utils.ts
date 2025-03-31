import { type QuestionType } from "../constants"

export function getQuestionTypeFromQuestion(question: {
  programmingQuestion?: unknown
  pictureQuestion?: unknown
}): QuestionType {
  if (question.programmingQuestion) {
    return "programming"
  }

  if (question.pictureQuestion) {
    return "picture"
  }

  throw new Error("Question has no type")
}

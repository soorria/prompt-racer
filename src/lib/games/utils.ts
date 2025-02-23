import type { Doc } from "../db/types"
import type { ChatHistoryItemContentType, ChatHistoryItemContentWithType } from "./schemas"
import { orderBy, schema } from "../db"
import { type QuestionType } from "./constants"

export function chatHistoryItemTypeIs<Type extends ChatHistoryItemContentType>(
  item: Doc<"playerGameSessionChatHistoryItems">,
  type: Type,
): item is Doc<"playerGameSessionChatHistoryItems"> & {
  content: ChatHistoryItemContentWithType<Type>
} {
  return item.content.type === type
}

export function getQuestionTestCasesOrderBy() {
  return orderBy.asc(schema.programmingQuestionTestCases.id)
}

export function getQuestionType(question: {
  programming_question_id: string | null | undefined
  picture_question_id: string | null | undefined
}): QuestionType {
  if (question.programming_question_id) {
    return "programming"
  }
  if (question.picture_question_id) {
    return "picture"
  }
  throw new Error("Invalid question: neither programming nor picture question found")
}

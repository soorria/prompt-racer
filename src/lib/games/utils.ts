import type { Doc } from "../db/types"
import type { ChatHistoryItemContentType, ChatHistoryItemContentWithType } from "./schemas"
import { orderBy, schema } from "../db"
import { randomElement } from "../utils/random"
import { GAME_MODES } from "./constants"

export function getRandomGameMode() {
  return randomElement(GAME_MODES)
}

export function chatHistoryItemTypeIs<Type extends ChatHistoryItemContentType>(
  item: Doc<"playerGameSessionChatHistoryItems">,
  type: Type,
): item is Doc<"playerGameSessionChatHistoryItems"> & {
  content: ChatHistoryItemContentWithType<Type>
} {
  return item.content.type === type
}

export function getQuestionTestCasesOrderBy() {
  return orderBy.asc(schema.questionTestCases.id)
}

import type { Doc } from "../db/types"
import type { QuestionType } from "./constants"
import type { ChatHistoryItemContentType, ChatHistoryItemContentWithType } from "./schemas"
import { orderBy, schema } from "../db"
import { randomElement } from "../utils/random"
import { GAME_MODE_DETAILS_LIST } from "./constants"

export function getRandomGameMode(questionType: QuestionType) {
  return (
    randomElement(
      GAME_MODE_DETAILS_LIST.filter(({ supportedQuestionTypes }) =>
        supportedQuestionTypes.includes(questionType),
      ),
    )?.id ?? "fastest-player"
  )
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
  return orderBy.asc(schema.programmingQuestionTestCases.id)
}

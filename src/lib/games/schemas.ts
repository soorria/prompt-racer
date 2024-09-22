import { z } from "zod"

export const ChatHistoryItemContentSchema = z.union([
  z.object({
    type: z.literal("instructions"),
    instructions: z.string(),
  }),
  z.object({
    type: z.literal("reset"),
  }),
  z.object({
    type: z.literal("ai"),
    rawCompletion: z.string(),
    parsedCompletion: z.union([
      z.object({
        state: z.literal("generating"),
        maybeCode: z.string(),
      }),
      z.object({
        state: z.literal("success"),
        maybeCode: z.string(),
      }),
      z.object({
        state: z.literal("error"),
        error: z.string(),
        raw: z.unknown().nullish(),
      }),
    ]),
  }),
])
export type ChatHistoryItemContent = z.infer<typeof ChatHistoryItemContentSchema>
export type ChatHistoryItemContentType = ChatHistoryItemContent["type"]
export type ChatHistoryItemContentWithType<Type extends ChatHistoryItemContentType> =
  ChatHistoryItemContent & {
    type: Type
  }

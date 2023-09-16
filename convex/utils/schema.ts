import { v } from "convex/values"

export const chatHistorySingleItem = {
  user: v.object({
    role: v.literal("user"),
    content: v.string(),
  }),
  ai: v.object({
    role: v.literal("ai"),
    content: v.string(),
    parsed: v.union(
      v.object({
        state: v.literal("generating"),
        maybeCode: v.string(),
      }),
      v.object({
        state: v.literal("success"),
        code: v.string(),
      }),
      v.object({
        state: v.literal("error"),
        error: v.string(),
        raw: v.any(),
      })
    ),
  }),
}

export const chatHistoryItem = v.union(chatHistorySingleItem.user, chatHistorySingleItem.ai)

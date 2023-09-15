import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"
import { chatHistoryItem } from "./utils/schema"

export default defineSchema({
  game: defineTable({
    question: v.any(),
    creatorId: v.string(),

    state: v.union(
      v.literal("waiting-for-players"),
      v.literal("in-progress"),
      v.literal("finished"),
      v.literal("cancelled")
    ),

    mode: v.literal("fastest-player"),

    gameStartTime: v.number(),
    gameEndTime: v.number(),
  }),

  playerGameInfo: defineTable({
    userId: v.string(),
    gameId: v.id("game"),

    code: v.string(),
    chatHistory: v.array(chatHistoryItem),

    lastPromptedAt: v.optional(v.number()),
    lastRanCodeAt: v.optional(v.number()),

    state: v.union(v.literal("playing"), v.literal("submitted")),
  }),
})

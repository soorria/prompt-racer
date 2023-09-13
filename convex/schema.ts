import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

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

    gameStartTime: v.string(),
    gameEndTime: v.string(),
  }),

  playerGameInfo: defineTable({
    userId: v.string(),
    gameId: v.id("game"),

    code: v.string(),
    chatHistory: v.array(v.any()),

    lastPromptedAt: v.optional(v.string()),
    lastRanCodeAt: v.optional(v.string()),

    state: v.union(v.literal("playing"), v.literal("submitted")),
  }),
})

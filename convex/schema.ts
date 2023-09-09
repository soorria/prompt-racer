import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  game: defineTable({
    question: v.any(),
    creatorId: v.string(),

    // TODO: add a "game state" enum
    state: v.union(
      v.literal("waiting-for-players"),
      v.literal("in-progress"),
      v.literal("finished")
    ),

    mode: v.literal("fastest-player"),

    createdTime: v.string(),

    gameStartTime: v.string(),
    gameEndTime: v.string(),
  }),

  playerGameInfo: defineTable({
    userId: v.string(),
    gameId: v.id("game"),

    code: v.string(),
    chatHistory: v.array(v.any()),

    lastPromptedAt: v.string(),
    lastRanCodeAt: v.string(),

    state: v.union(v.literal("playing"), v.literal("submitted")),
  }),
})

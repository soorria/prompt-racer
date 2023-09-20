import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"
import { chatHistoryItem, codeRunResult, playerGameInfoTestState } from "./utils/schema"

const questionSchema = {
  title: v.string(),
  description: v.string(),
  difficulty: v.optional(v.union(v.literal("easy"), v.literal("medium"), v.literal("hard"))),
  starting_code: v.string(),
  test_cases: v.array(
    v.object({
      args: v.array(v.any()),
      expected: v.any(),
    })
  ),

  source: v.union(
    v.object({
      type: v.literal("ai"),
      link: v.object({
        url: v.string(),
        title: v.string(),
      }),
    }),
    v.object({
      type: v.literal("project-euler"),
      number: v.number(),
    })
  ),
} as const

export default defineSchema({
  game: defineTable({
    question: v.object({ ...questionSchema, examples: questionSchema.test_cases }),
    creatorId: v.string(),

    state: v.union(
      v.literal("waiting-for-players"),
      v.literal("in-progress"),
      v.literal("finished"),
      v.literal("cancelled")
    ),

    players: v.optional(
      v.array(
        v.object({
          name: v.string(),
          profilePictureUrl: v.string(),
          userId: v.string(),
        })
      )
    ),

    mode: v.literal("fastest-player"),

    gameStartTime: v.number(),
    gameEndTime: v.number(),
  }),

  playerGameInfo: defineTable({
    userId: v.string(),
    gameId: v.id("game"),

    code: v.string(),

    lastPromptedAt: v.optional(v.number()),
    chatHistory: v.array(chatHistoryItem),

    lastTestedAt: v.optional(v.number()),
    testState: v.optional(playerGameInfoTestState),

    lastSubmittedAt: v.optional(v.number()),
    submissionState: v.optional(playerGameInfoTestState),

    state: v.union(v.literal("playing"), v.literal("submitted")),
  })
    .index("by_gameId", ["gameId"])
    .index("by_userId", ["userId"])
    .index("by_gameId_userId", ["gameId", "userId"]),

  question: defineTable(questionSchema),
})

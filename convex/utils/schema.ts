import { Infer, v } from "convex/values"

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
  reset: v.object({ role: v.literal("reset") }),
}

export const chatHistoryItem = v.union(
  chatHistorySingleItem.user,
  chatHistorySingleItem.ai,
  chatHistorySingleItem.reset
)

export const codeRunResult = v.union(
  v.object({
    status: v.literal("success"),
    result: v.any(),
    time: v.optional(v.number()),
  }),
  v.object({
    status: v.literal("error"),
    reason: v.object({
      name: v.string(),
      message: v.string(),
    }),
    time: v.optional(v.number()),
  })
)

export type CodeRunResult = Infer<typeof codeRunResult>

export const playerGameInfoTestState = v.union(
  v.object({
    type: v.literal("running"),
  }),
  v.object({
    type: v.literal("complete"),
    results: v.array(codeRunResult),
  })
)

export const gamePlayer = v.object({
  name: v.string(),
  profilePictureUrl: v.string(),
  userId: v.string(),
})

export const gameModes = ["fastest-player", "fastest-code"] as const

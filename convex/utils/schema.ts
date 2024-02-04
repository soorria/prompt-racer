import { Infer, v, Validator } from "convex/values"

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

const nah = v.literal("nah")

export const gamePlayer = v.object({
  userId: v.string(),
  name: v.string(),
  profilePictureUrl: v.string(),
  position: v.optional(v.union(v.number(), nah)),

  score: v.optional(v.union(v.number(), nah)),
  starting_rating: v.optional(v.number()),
  ending_rating: v.optional(v.number()),
})

type GameModesList = [
  "fastest-player",
  "fastest-code",
  "shortest-code",
  "shortest-messages-word-length"
]
export const gameModes: Readonly<GameModesList> = [
  "fastest-player",
  "fastest-code",
  "shortest-code",
  "shortest-messages-word-length",
]

type ToValidators<T extends readonly string[], Acc extends Validator<string>[] = []> = T extends [
  infer H,
  ...infer R extends readonly string[]
]
  ? H extends string
    ? ToValidators<R, [...Acc, Validator<H>]>
    : never
  : Acc
type GameModeValidatorsList = ToValidators<GameModesList>

export const gameModeSchema = v.union(...(gameModes.map(v.literal) as GameModeValidatorsList))

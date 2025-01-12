import type { ZodObject, ZodRawShape } from "zod"
import { z } from "zod"

function defineEventSchema<Type extends string, Schema extends ZodObject<ZodRawShape>>(
  type: Type,
  schema: Schema,
) {
  return z.object({
    type: z.literal(type),
    data: schema,
  })
}

export const gameEventSchema = z.discriminatedUnion("type", [
  defineEventSchema(
    "player-joined",
    z.object({
      player: z.object({
        id: z.string(),
        name: z.string(),
        profile_image_url: z.string().nullable(),
        wins: z.number(),
      }),
    }),
  ),
])
export type GameEvent = z.infer<typeof gameEventSchema>

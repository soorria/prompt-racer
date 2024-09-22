import { z } from "zod"
import { MAX_SEND_MESSAGE_CHARACTER_LIMIT } from "~/lib/games/constants"

import { sendMessageInGame } from "~/lib/games/internal-actions"

const BodySchema = z.object({
  gameId: z.string(),
  prompt: z.string().min(1).max(MAX_SEND_MESSAGE_CHARACTER_LIMIT),
})

export const POST = async (request: Request) => {
  try {
    const { gameId, prompt } = BodySchema.parse(await request.json())

    const stream = await sendMessageInGame(gameId, prompt)

    return stream.toDataStreamResponse()
  } catch (e) {
    // TODO: better error handling
    throw new Response("Invalid request body", {
      status: 400,
    })
  }
}

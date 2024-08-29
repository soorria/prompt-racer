import { z } from "zod"

import { sendMessageInGame } from "~/lib/games/internal-actions"

const BodySchema = z.object({
  gameId: z.string(),
  prompt: z.string().min(1).max(50),
})

export const POST = async (request: Request) => {
  try {
    const { gameId, prompt } = BodySchema.parse(await request.json())

    const stream = await sendMessageInGame(gameId, prompt)

    return stream.toDataStreamResponse()
  } catch (e) {
    throw new Response("Invalid request body", {
      status: 400,
    })
  }
}

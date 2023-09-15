"use node"
import { OpenAI } from "openai"

import { internalAction } from "./_generated/server"
import { Doc, Id } from "./_generated/dataModel"
import { internal } from "./_generated/api"
import { v } from "convex/values"

export const codeGeneration = internalAction({
  args: {
    playerGameInfoId: v.id("playerGameInfo"),
    message: v.string(),
    currentCode: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.OPENAI_API_KEY
    const openai = new OpenAI({ apiKey })

    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      temperature: 0.7,
      stop: ["</code>"],
      messages: [
        {
          role: "system",
          content: [
            "You are a terse, helpful AI assistant that helps people write code.",
            "You should only ever output code wrapped in a <code> tag.",
            "Never update the existing function's name or argument list.",
          ].join(" "),
        },
        {
          role: "user",
          content: `
<code>
${args.currentCode}
</code>

<instructions>
${args.message}
</instructions>

Follow the instructions to update the provided python code. Output only the updated code wrapped in a <code> tag.

OUTPUT:
`.trim(),
        },
      ],
    })

    // Hack to access private property
    const response = (stream as unknown as { response: Response }).response

    if (!response.ok) {
      await ctx.runMutation(internal.games.setAgentMessageForPlayerInGame, {
        playerGameInfoId: args.playerGameInfoId,
        data: {
          type: "error",
          message: "Failed to generate code.",
          raw: await response.text(),
        },
      })
    }

    let fullResponse = ""

    for await (const chunk of stream) {
      fullResponse += chunk.choices[0]?.delta.content ?? ""
      await ctx.runMutation(internal.games.setAgentMessageForPlayerInGame, {
        playerGameInfoId: args.playerGameInfoId,
        data: {
          type: "partial",
          message: fullResponse,
        },
      })
    }

    await ctx.runMutation(internal.games.setAgentMessageForPlayerInGame, {
      playerGameInfoId: args.playerGameInfoId,
      data: {
        type: "success",
        message: fullResponse,
      },
    })
  },
})

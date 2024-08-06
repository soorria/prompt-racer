import "server-only"

import type { LanguageModel } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { invariant } from "@epic-web/invariant"
import { generateText, streamText } from "ai"

import { env } from "~/env"
import { type ModelId } from "./constants"
import { parseModelId } from "./utils"

function getOpenAIKey(): string {
  const keys = env.OPENAI_API_KEYS.split(",")
  const key = keys[Math.floor(Math.random() * keys.length)]
  invariant(key, "missing openai key")
  return key
}

function getAIModelProvider(modelId: ModelId): LanguageModel {
  const { provider, model } = parseModelId(modelId)

  if (provider === "openai") {
    const getOpenAIModel = createOpenAI({
      apiKey: getOpenAIKey(),
    })
    return getOpenAIModel(model)
  }

  throw new Error(`Unsupported model provider: ${provider as string}`)
}

export async function streamUpdatedCode(args: {
  existingCode: string
  instructions: string
  modelId: ModelId
}) {
  const stream = await generateText({
    model: getAIModelProvider(args.modelId),
    temperature: 0.7,
    stopSequences: ["</code>"],
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
CURRENT CODE: <code>
${args.existingCode}
</code>

INSTRUCTIONS: <instructions>
${args.instructions}
</instructions>

Follow the instructions to update the provided python code. Output only the updated code wrapped in a <code> tag.
The update code should contain a function named "solution", and the arguments should be the same as the current code.

UPDATED CODE:
`.trim(),
      },
    ],
  })

  return stream
}

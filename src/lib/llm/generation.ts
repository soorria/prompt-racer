import "server-only"

import type { LanguageModel } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { invariant } from "@epic-web/invariant"
import { streamText } from "ai"

import { env } from "~/env"
import { QuestionType } from "../games/constants"
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

  const exhaustiveCheck: never = provider
  throw new Error(`Unsupported model provider: ${exhaustiveCheck as string}`)
}

export async function streamUpdatedCode(args: {
  existingCode: string
  instructions: string
  modelId: ModelId
  questionType: QuestionType
  onFinish?: Parameters<typeof streamText>[0]["onFinish"]
}) {
  const systemPrompt =
    args.questionType === "programming"
      ? [
          "You are a terse, helpful AI assistant that helps people write code.",
          "You should only ever output code wrapped in a <code> tag.",
          "Never update the existing function's name or argument list.",
        ].join(" ")
      : [
          "You are a terse, helpful AI assistant that creates images using HTML and CSS.",
          "You should only ever output code wrapped in a <code> tag.",
          "Your code must consist of a <style> section and HTML elements.",
          "Use only HTML and CSS to create visual designs - no JavaScript.",
          "Focus on geometric shapes, colors, and positioning to create the requested image.",
        ].join(" ")

  const userPrompt =
    args.questionType === "programming"
      ? `
CURRENT CODE: <code>
${args.existingCode}
</code>

INSTRUCTIONS: <instructions>
${args.instructions}
</instructions>

Follow the instructions to update the provided python code. Output only the updated code wrapped in a <code> tag.
The update code should contain a function named "solution", and the arguments should be the same as the current code.

UPDATED CODE:
`.trim()
      : `
CURRENT CODE: <code>
${args.existingCode}
</code>

INSTRUCTIONS: <instructions>
${args.instructions}
</instructions>

Create an image using only HTML and CSS based on the instructions. Output only the code wrapped in a <code> tag.
Your code should include both the HTML structure and CSS styles needed to create the image.
Keep the code minimal and efficient.

UPDATED CODE:
`.trim()

  const stream = await streamText({
    model: getAIModelProvider(args.modelId),
    temperature: 0.7,
    stopSequences: ["</code>"],
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
    onFinish: args.onFinish,
  })

  return stream
}

import "server-only"

import { createOpenAI } from "@ai-sdk/openai"
import { invariant } from "@epic-web/invariant"
import { streamText } from "ai"

import { env } from "~/env"

function getOpenAIKey(): string {
  const keys = env.OPENAI_API_KEYS.split(",")
  const key = keys[Math.floor(Math.random() * keys.length)]
  invariant(key, "missing openai key")
  return key
}

export async function streamUpdatedCode(existingCode: string, instructions: string) {
  const getOpenAIModel = createOpenAI({
    apiKey: getOpenAIKey(),
  })

  const model = getOpenAIModel("gpt-4o-mini")

  const stream = await streamText({
    model,
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
${existingCode}
</code>

INSTRUCTIONS: <instructions>
${instructions}
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

import { invariant } from "@epic-web/invariant"

import type { ExtractModelDetails, ModelId, ModelName, ModelProvider } from "./constants"
import { MODEL_MAP } from "./constants"

export function parseModelId<Id extends ModelId>(modelId: Id): ExtractModelDetails<Id> {
  const [provider, model] = modelId.split("::")

  invariant(provider && model, "Invalid model id")
  const modelNamesForProvider = MODEL_MAP[provider as ModelProvider]
  invariant(
    modelNamesForProvider?.[model as ModelName<ModelProvider>],
    "Invalid model provider or name",
  )

  return { provider, model } as ExtractModelDetails<Id>
}

export function extractCodeFromRawCompletion(content: string) {
  // !! NOTE: need to change the tags we use when / if we add html/css mode
  const openingTagIndex = content.indexOf("<code>")
  // TODO: should we do lastIndexOf?
  const closingTagIndex = content.indexOf("</code>")

  if (openingTagIndex === -1) {
    return null
  }

  return content
    .slice(openingTagIndex + "<code>".length, closingTagIndex === -1 ? undefined : closingTagIndex)
    .trim()
}

type ModelConfig = {
  name: string
}
type UnspecificModelMap = Record<string, Record<string, ModelConfig>>
export type ModelMap = typeof MODEL_MAP
export type ModelId = {
  [Provider in keyof ModelMap]: `${Provider}${typeof MODEL_ID_SEPERATOR}${keyof ModelMap[Provider] extends string ? keyof ModelMap[Provider] : never}`
}[keyof ModelMap]
export type ModelProvider = keyof ModelMap
export type ModelName<Provider extends ModelProvider> = keyof ModelMap[Provider]

const MODEL_ID_SEPERATOR = "::"
export const MODEL_MAP = {
  openai: {
    "gpt-4o-mini": {
      name: "GPT 4o Mini",
    },
  },
} as const satisfies UnspecificModelMap
export const MODEL_IDS = Object.entries(MODEL_MAP).flatMap(([provider, models]) =>
  Object.entries(models).map(([model]) => `${provider}${MODEL_ID_SEPERATOR}${model}`),
) as ModelId[]

export const DEFAULT_MODEL_ID: ModelId = "openai::gpt-4o-mini"

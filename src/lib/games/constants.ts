import ms from "ms"

import { type Doc } from "../db/types"


export type KebabToPascalCase<T extends string> = T extends `${infer F}-${infer R}`
  ? `${F}${Capitalize<KebabToPascalCase<R>>}`
  : Capitalize<T>

export const DEFAULT_GAME_DURATIONS = {
  waitingForPlayers: ms("30s"),
  inProgress: ms("5m"),
}

export type GameMode = Doc<"gameStates">["mode"]
export const GAME_MODES = [
  "fastest-code",
  "fastest-player",
  "shortest-code",
  "fewest-characters-to-llm",
] as const satisfies GameMode[]
export const GAME_MODES_WITH_TITLES = {
  "fastest-code": "Fastest Code",
  "fastest-player": "Fastest Player",
  "shortest-code": "Shortest Code",
  "fewest-characters-to-llm": "Fewest Characters to LLM",
} as const satisfies Record<GameMode, string>

export const LLM_PROMPTING_TIMEOUT = ms("10s")
export const CODE_SUBMISSION_TIMEOUT = ms("10s")
export const FINALIZING_SUBMISSION_BUFFER_TIME = ms("2s")

import ms from "ms"

import { type Doc } from "../db/types"

export const DEFAULT_GAME_DURATIONS = {
  waitingForPlayers: ms("30s"),
  inProgress: ms("5m"),
}

export const GAME_MODES = [
  "fastest-code",
  "fastest-player",
  "shortest-code",
  "fewest-characters-to-llm",
] as const satisfies Doc<"gameStates">["mode"][]

export const LLM_PROMPTING_TIMEOUT = ms("10s")
export const CODE_SUBMISSION_TIMEOUT = ms("10s")
export const FINALIZING_SUBMISSION_BUFFER_TIME = ms("2s")

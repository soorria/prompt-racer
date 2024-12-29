import type { LucideIcon } from "lucide-react"
import { Gauge, MessageCircle, Minimize2, Timer } from "lucide-react"
import ms from "ms"

import type { gameStatusEnum, questionDifficultyEnum } from "../db/schema"
import type { Doc } from "../db/types"
import { entries } from "../utils/object"

export type KebabToPascalCase<T extends string> = T extends `${infer F}-${infer R}`
  ? `${F}${Capitalize<KebabToPascalCase<R>>}`
  : Capitalize<T>

export const DEFAULT_GAME_DURATIONS = {
  waitingForPlayers: ms("30s"),
  inProgress: ms("5m"),
}

export type GameMode = (typeof GAME_MODES)[number]
export const GAME_MODES = [
  "fastest-player",
  "fastest-code",
  "shortest-code",
  "fewest-characters-to-llm",
] as const

export type QuestionDifficultyLevels = (typeof questionDifficultyEnum)["enumValues"][number]
// this isnt a strict satisfies need to think how to do it strictly
export const QUESTION_DIFFICULTY_LEVELS = [
  "easy",
  "medium",
  "hard",
] as const satisfies QuestionDifficultyLevels[]

export type GameStatus = (typeof gameStatusEnum)["enumValues"][number]
export const GAME_STATUS = [
  "waitingForPlayers",
  "inProgress",
  "finished",
] as const satisfies GameStatus[]

export const LLM_PROMPTING_TIMEOUT = ms("10s")
export const CODE_SUBMISSION_TIMEOUT = ms("10s")
export const FINALIZING_SUBMISSION_BUFFER_TIME = ms("2s")
export const GAME_CHARACTER_LIMIT_MAP = {
  easy: 50,
  medium: 60,
  hard: 70,
} as const satisfies Record<Doc<"questions">["difficulty"], number>
export const MAX_SEND_MESSAGE_CHARACTER_LIMIT = Math.max(...Object.values(GAME_CHARACTER_LIMIT_MAP))

export type GameModeIds = Doc<"gameStates">["mode"]
export type GameModeDetailsItem = {
  title: string
  description: string
  unitLong: string
  unitShort: string
  toDisplayValue: (value: number) => number
  icon: LucideIcon
  color: string
}
export const GAME_MODE_DETAILS: Record<GameModeIds, GameModeDetailsItem> = {
  "fastest-player": {
    title: "Speed Demon",
    description: "Race against others to solve the challenge first. Fast thinking wins!",
    unitLong: "seconds",
    unitShort: "s",
    toDisplayValue: (ms: number) => ms / 1000,
    icon: Timer,
    color: "bg-orange-300",
  },
  "fastest-code": {
    title: "Turbo Code",
    description: "Your code needs speed! Create the fastest executing solution.",
    unitLong: "seconds",
    unitShort: "s",
    // Runtimes longer than `5000ms` are displayed in seconds
    toDisplayValue: (ms: number) => (ms > 5000 ? ms / 1000 : ms),
    icon: Gauge,
    color: "bg-green-300",
  },
  "shortest-code": {
    title: "Minimalist",
    description: "Less is more. Write working code with the fewest characters possible.",
    unitLong: "characters",
    unitShort: "ch",
    toDisplayValue: (v) => v,
    icon: Minimize2,
    color: "bg-purple-300",
  },
  "fewest-characters-to-llm": {
    title: "AI Whisperer",
    description: "Master of brevity. Craft the shortest prompt that gets the job done.",
    unitLong: "characters",
    unitShort: "ch",
    toDisplayValue: (v) => v,
    icon: MessageCircle,
    color: "bg-blue-300",
  },
}
export const GAME_MODE_DETAILS_LIST = entries(GAME_MODE_DETAILS).map(([id, details]) => ({
  id: id,
  ...details,
}))

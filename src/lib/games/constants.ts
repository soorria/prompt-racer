import ms from "ms"

import type { Doc } from "../db/types"
import { gameStatusEnum, questionDifficultyEnum } from "../db/schema"

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

export type QuestionDifficultyLevels = (typeof questionDifficultyEnum)['enumValues'][number]
// this isnt a strict satisfies need to think how to do it strictly
export const QUESTION_DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'] as const satisfies QuestionDifficultyLevels[];

export type GameStatus = (typeof gameStatusEnum)['enumValues'][number]
export const GAME_STATUS = ['waitingForPlayers', 'inProgress', 'finished'] as const satisfies GameStatus[];

export const LLM_PROMPTING_TIMEOUT = ms("10s")
export const CODE_SUBMISSION_TIMEOUT = ms("10s")
export const FINALIZING_SUBMISSION_BUFFER_TIME = ms("2s")
export const GAME_CHARACTER_LIMIT_MAP = {
  easy: 50,
  medium: 60,
  hard: 70,
} as const satisfies Record<Doc<"questions">["difficulty"], number>
export const MAX_SEND_MESSAGE_CHARACTER_LIMIT = Math.max(...Object.values(GAME_CHARACTER_LIMIT_MAP))

export const GAME_MODE_DETAILS: Record<
  Doc<"gameStates">["mode"],
  {
    title: string
    description: string
    unitLong: string
    unitShort: string
  }
> = {
  "fastest-player": {
    title: "Fastest Player",
    description: "The fastest player to submit the correct answer wins!",
    unitLong: "seconds",
    unitShort: "s",
  },
  "fastest-code": {
    title: "Fastest Code",
    description: "The code that runs the fastest wins!",
    unitLong: "seconds",
    unitShort: "s",
  },
  "shortest-code": {
    title: "Shortest Code",
    description: "The fewest amount of lines/characters of code wins!",
    unitLong: "characters",
    unitShort: "ch",
  },
  "fewest-characters-to-llm": {
    title: "Fewest Characters to LLM",
    description: "The fewest characters able to generate the correct answer wins!",
    unitLong: "characters",
    unitShort: "ch",
  },
}

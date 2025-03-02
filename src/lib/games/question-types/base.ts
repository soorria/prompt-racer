import { invariant } from "@epic-web/invariant"

import type { GameMode, QuestionDifficultyLevels, QuestionType } from "../constants"
import type { QuestionTestState } from "../types"
import { entries } from "~/lib/utils/object"
import { randomElement } from "~/lib/utils/random"
import { GAME_MODE_DETAILS } from "../constants"

export abstract class BaseQuestionStrategy {
  constructor(readonly config: QuestionTypeConfig) {}
}

export interface ClientQuestionStrategy extends BaseQuestionStrategy {
  readonly difficulty: QuestionDifficultyLevels
  readonly title: string
  readonly description: string
  readonly preview: JSX.Element
  results: (testState: QuestionTestState | null) => JSX.Element
}

export abstract class QuestionTypeConfig {
  abstract readonly supportedModeIds: readonly GameMode[]

  get supportedGameModes() {
    return entries(GAME_MODE_DETAILS)
      .filter(([id]) => this.supportedModeIds.includes(id))
      .map(([id, details]) => ({ id, ...details }))
  }

  getRandomGameMode() {
    invariant(this.supportedModeIds.length > 0, "No supported game modes")
    return randomElement(this.supportedModeIds)!
  }

  abstract isCompatibleQuestion(question: {
    programmingQuestion: object | null
    pictureQuestion: object | null
  }): boolean
}

export function getQuestionType(question: {
  programming_question_id: string | null | undefined
  picture_question_id: string | null | undefined
}): QuestionType {
  if (question.programming_question_id) {
    return "programming"
  }
  if (question.picture_question_id) {
    return "picture"
  }
  throw new Error("Invalid question: neither programming nor picture question found")
}

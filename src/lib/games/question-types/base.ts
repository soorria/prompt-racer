import { invariant } from "@epic-web/invariant"

import type { GameMode, QuestionDifficultyLevels } from "../constants"
import type { DBOrTransaction, Doc } from "~/lib/db/types"
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
}

export abstract class ServerQuestionStrategy extends BaseQuestionStrategy {
  abstract getOrGenerateQuestion(
    tx: DBOrTransaction,
    options: {
      difficulty?: QuestionDifficultyLevels
    },
  ): Promise<
    Doc<"questions"> & {
      programmingQuestion: Doc<"programmingQuestions"> | null
      pictureQuestion: Doc<"pictureQuestions"> | null
    }
  >
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

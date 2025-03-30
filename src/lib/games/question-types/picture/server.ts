import "server-only"

import { invariant } from "@epic-web/invariant"

import type { QuestionDifficultyLevel } from "../../constants"
import type { DBOrTransaction } from "~/lib/db/types"
import { schema } from "~/lib/db"
import { randomElement } from "~/lib/utils/random"
import { QUESTION_DIFFICULTY_LEVELS } from "../../constants"
import { BaseQuestionStrategy } from "../base"
import { type QuestionWithTypeDetails, type ServerQuestionStrategy } from "../server_base"
import { PictureQuestionConfig } from "./config"
import { generatePictureQuestion } from "./question-generation"

export class ServerPictureStrategy extends BaseQuestionStrategy implements ServerQuestionStrategy {
  constructor() {
    super(new PictureQuestionConfig())
  }

  async getOrGenerateQuestion(
    tx: DBOrTransaction,
    options: {
      difficulty?: QuestionDifficultyLevel
    },
  ) {
    const difficulty = options.difficulty ?? randomElement(QUESTION_DIFFICULTY_LEVELS)

    const pictureQuestion = await generatePictureQuestion({
      difficulty,
    })

    const [insertedPictureQuestion] = await tx
      .insert(schema.pictureQuestions)
      .values(pictureQuestion)
      .returning({
        id: schema.pictureQuestions.id,
      })

    invariant(insertedPictureQuestion, "Failed to insert picture question")

    const [insertedQuestion] = await tx
      .insert(schema.questions)
      .values({
        difficulty,
        picture_question_id: insertedPictureQuestion.id,
      })
      .returning()

    invariant(insertedQuestion, "Failed to insert question")

    return {
      ...insertedQuestion,
      programmingQuestion: null,
      pictureQuestion: {
        ...insertedPictureQuestion,
        description: pictureQuestion.description,
        starterCode: pictureQuestion.starterCode,
        solution_image_url: pictureQuestion.solution_image_url,
      },
    }
  }

  getStarterCode(question: QuestionWithTypeDetails) {
    return question.pictureQuestion?.starterCode ?? ""
  }
}

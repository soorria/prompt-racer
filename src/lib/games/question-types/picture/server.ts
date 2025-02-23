import type { SQL } from "drizzle-orm"
import { invariant } from "@epic-web/invariant"
import { count } from "drizzle-orm"

import type { ServerQuestionStrategy } from "../base"
import type { DBOrTransaction } from "~/lib/db/types"
import { cmp, schema } from "~/lib/db"
import { type QuestionDifficultyLevels } from "../../constants"
import { BaseQuestionStrategy } from "../base"
import { PictureQuestionConfig } from "./config"

export class ServerPictureStrategy extends BaseQuestionStrategy implements ServerQuestionStrategy {
  constructor() {
    super(new PictureQuestionConfig())
  }

  async getOrGenerateQuestion(
    tx: DBOrTransaction,
    options: {
      difficulty?: QuestionDifficultyLevels
    },
  ) {
    let condition: SQL<unknown> | undefined = cmp.isNotNull(
      schema.questions.programming_question_id,
    )
    if (options.difficulty) {
      condition = cmp.and(condition, cmp.eq(schema.questions.difficulty, options.difficulty))
    }
    condition = cmp.and(condition, cmp.isNotNull(schema.questions.picture_question_id))

    const countQuery = tx.select({ count: count() }).from(schema.questions).where(condition)

    const [numQuestions] = await countQuery

    invariant(numQuestions?.count, "No questions found")

    const randomIndex = Math.floor(Math.random() * numQuestions.count)

    const question = await tx.query.questions.findFirst({
      where: condition,
      offset: randomIndex,
      with: {
        programmingQuestion: true,
        pictureQuestion: true,
      },
    })

    invariant(question, "No question found")

    return question
  }
}

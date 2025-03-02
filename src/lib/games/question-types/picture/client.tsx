import { invariant } from "@epic-web/invariant"

import type { FullQuestion } from "../../types"
import type { ClientQuestionStrategy } from "../base"
import { PictureQuestionResults } from "~/components/game-screen/PictureQuestionResults"
import { type QuestionTestState } from "../../types"
import { BaseQuestionStrategy } from "../base"
import { PictureQuestionConfig } from "./config"

export class PictureQuestionStrategy
  extends BaseQuestionStrategy
  implements ClientQuestionStrategy
{
  private readonly question: FullQuestion & {
    pictureQuestion: NonNullable<FullQuestion["pictureQuestion"]>
  }

  constructor(question: FullQuestion) {
    super(new PictureQuestionConfig())
    invariant(question.pictureQuestion, "Picture question is required")
    this.question = question
  }

  get difficulty() {
    return this.question.difficulty
  }

  readonly title = "this.question.pictureQuestion.title"

  readonly description = "this.question.pictureQuestion.description"

  get preview() {
    return <div>Picture question</div>
  }

  results(testState: QuestionTestState | null) {
    return <PictureQuestionResults question={this.question} testState={testState} />
  }
}

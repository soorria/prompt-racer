import { invariant } from "@epic-web/invariant"

import type { FullQuestion } from "../../types"
import type { ClientQuestionStrategy } from "../base"
import { PictureQuestionDescription } from "~/components/game-screen/picture/PictureQuestionDescription"
import { PictureQuestionResults } from "~/components/game-screen/picture/PictureQuestionResults"
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

  descriptionPanel() {
    return { content: <PictureQuestionDescription question={this.question} /> }
  }

  resultsPanel() {
    return { content: <PictureQuestionResults />, footer: <></> }
  }
}

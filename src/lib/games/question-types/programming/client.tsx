import { invariant } from "@epic-web/invariant"

import type { FullQuestion } from "../../types"
import type { ClientQuestionStrategy } from "../base"
import ProgrammingCodeRunningFooter from "~/components/game-screen/ProgrammingCodeRunningFooter"
import { ProgrammingQuestionDescription } from "~/components/game-screen/ProgrammingQuestionDescription"
import { ProgrammingQuestionResults } from "~/components/game-screen/ProgrammingQuestionResults"
import { BaseQuestionStrategy } from "../base"
import { ProgrammingQuestionConfig } from "./config"

export class ProgrammingQuestionStrategy
  extends BaseQuestionStrategy
  implements ClientQuestionStrategy
{
  private readonly question: FullQuestion & {
    programmingQuestion: NonNullable<FullQuestion["programmingQuestion"]>
  }

  constructor(question: FullQuestion) {
    super(new ProgrammingQuestionConfig())
    invariant(question.programmingQuestion, "Programming question is required")
    this.question = question
  }

  descriptionPanel() {
    return {
      content: <ProgrammingQuestionDescription question={this.question} />,
    }
  }

  resultsPanel() {
    return {
      content: <ProgrammingQuestionResults question={this.question} />,
      footer: <ProgrammingCodeRunningFooter />,
    }
  }
}

import { invariant } from "@epic-web/invariant"
import { TestTubeDiagonal } from "lucide-react"

import { type FullQuestion } from "../../types"
import { BaseQuestionStrategy } from "../base"
import { ProgrammingQuestionConfig } from "./config"

export class ProgrammingQuestionStrategy extends BaseQuestionStrategy {
  private readonly question: FullQuestion & {
    programmingQuestion: NonNullable<FullQuestion["programmingQuestion"]>
  }

  constructor(question: FullQuestion) {
    super(new ProgrammingQuestionConfig())
    invariant(question.programmingQuestion, "Programming question is required")
    this.question = question
  }

  get difficulty() {
    return this.question.difficulty
  }

  get title() {
    return this.question.programmingQuestion.title
  }

  get description() {
    return this.question.programmingQuestion.description
  }

  get preview() {
    return (
      <div>
        <div className="mb-4 mt-8">
          <h3 className="mb-2 font-medium">Test cases</h3>
          <div className="space-y-2 text-sm">
            {this.question.programmingQuestion.testCases.map((testCase, i) => (
              <div key={i} className="whitespace-pre-wrap font-mono">
                <div className="flex items-center gap-2">
                  <span className="justify-self-center">
                    <TestTubeDiagonal />
                  </span>
                  <span>
                    solution({testCase.args.map((a) => JSON.stringify(a)).join(", ")}) =={" "}
                    {JSON.stringify(testCase.expectedOutput)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

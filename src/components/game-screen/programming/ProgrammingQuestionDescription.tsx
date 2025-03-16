import { TestTubeDiagonal } from "lucide-react"
import Markdown from "react-markdown"

import type { ProgrammingQuestionWithTestCases } from "~/lib/games/types"
import { GAME_MODE_DETAILS } from "~/lib/games/constants"
import { DifficultyToBadgeVariantMap } from "~/lib/games/types"
import { Badge } from "../../ui/badge"
import { WinConditionCard } from "../../WinConditionCard"
import { useGameManager } from "../GameManagerProvider"

export function ProgrammingQuestionDescription({
  question,
}: {
  question: ProgrammingQuestionWithTestCases
}) {
  const { gameInfo } = useGameManager()
  return (
    <div>
      <div className="mb-1 text-2xl font-bold">{question.programmingQuestion.title}</div>
      <Badge variant={DifficultyToBadgeVariantMap[question.difficulty]} className="mb-2">
        {question.difficulty}
      </Badge>
      <WinConditionCard mode={GAME_MODE_DETAILS[gameInfo.mode]} />
      <div className="text-pretty text-sm">
        <Markdown className={"prose prose-invert"}>
          {question.programmingQuestion.description}
        </Markdown>
      </div>

      <div>
        <div className="mb-4 mt-8">
          <h3 className="mb-2 font-medium">Test cases</h3>
          <div className="space-y-2 text-sm">
            {question.programmingQuestion.testCases.map((testCase, i) => (
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
    </div>
  )
}

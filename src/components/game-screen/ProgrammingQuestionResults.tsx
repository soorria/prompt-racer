import type { ReactNode } from "react"
import React from "react"
import { CheckCircle2, Loader2, MinusCircleIcon, XCircle } from "lucide-react"

import type { PlayerGameSession } from "~/lib/games/types"
import { type ProgrammingQuestionWithTestCases } from "~/lib/games/types"

export function ProgrammingQuestionResults(props: {
  question: ProgrammingQuestionWithTestCases
  testState: PlayerGameSession["testState"] | undefined
}) {
  const testResultByTestCaseId = Object.fromEntries(
    props.testState?.programmingResults.map((result) => [
      `${result.programming_question_test_case_id}`,
      result,
    ]) ?? [],
  )

  const correctTestCases = props.question.programmingQuestion.testCases.filter((tc) => {
    const result = testResultByTestCaseId[tc.id]
    return result?.status === "success" && result.is_correct
  })

  const incorrectTestCases = props.question.programmingQuestion.testCases.filter((tc) => {
    const result = testResultByTestCaseId[tc.id]
    return result && (result.status === "error" || !result.is_correct)
  })

  const unsubmittedTestCases = props.question.programmingQuestion.testCases.filter((tc) => {
    return !testResultByTestCaseId[tc.id]
  })

  const sortedTestCases = [...unsubmittedTestCases, ...incorrectTestCases, ...correctTestCases]

  console.log("sortedTestCases", sortedTestCases)
  return (
    <div className="flex flex-col space-y-6 text-sm">
      {sortedTestCases.map((testCase, i) => {
        const result = props.testState?.programmingResults.find(
          (result) => result.programming_question_test_case_id === testCase.id,
        )

        let testEmoji: ReactNode
        if (props.testState?.status === "running") {
          testEmoji = (
            <span title="Running test">
              <Loader2 className="animate-spin sq-6" />
            </span>
          )
        } else if (result) {
          testEmoji = (
            <span title={result.status === "success" ? "Test passed" : "Test failed"}>
              {result.status === "success" && result.is_correct ? (
                <CheckCircle2 className="s q-6 rounded-full bg-primary text-black" />
              ) : (
                <XCircle className="rounded-full bg-red-500 text-black sq-6" />
              )}
            </span>
          )
        } else {
          testEmoji = (
            <span className="grayscale" title="No tests run">
              <MinusCircleIcon className="rounded-full bg-primary text-black sq-6" />
            </span>
          )
        }
        return (
          <div key={i} className="whitespace-pre-wrap font-mono">
            <div className="flex items-center gap-2">
              <span className="justify-self-center">{testEmoji}</span>
              <span>
                solution({testCase.args.map((a) => JSON.stringify(a)).join(", ")}) =={" "}
                {JSON.stringify(testCase.expectedOutput)}
              </span>
            </div>
            {result?.status === "success" && !result.is_correct && (
              <div className="mt-3 whitespace-pre-wrap rounded-xl bg-red-500/20 p-4 text-red-500 bg-blend-color-burn">
                Output: {JSON.stringify(result.result)}
              </div>
            )}
            {result?.status === "error" && (
              <div className="mt-3 whitespace-pre-wrap rounded-xl bg-red-500/20 p-4 text-red-500 bg-blend-color-burn">
                {result.reason}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

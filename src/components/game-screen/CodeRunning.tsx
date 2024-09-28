import type { ReactNode } from "react"
import React from "react"
import { CheckCircle2, Loader2, MinusCircleIcon, XCircle } from "lucide-react"

import { type PlayerGameSession, type QuestionWithTestCases } from "~/lib/games/types"
import { api } from "~/lib/trpc/react"
import { Skeleton } from "../ui/skeleton"
import { useGameManager } from "./GameManagerProvider"

function QuestionTestCaseResults(props: {
  question: QuestionWithTestCases
  testState: PlayerGameSession["testState"]
}) {
  const testResultByTestCaseId = Object.fromEntries(
    props.testState?.results.map((result) => [`${result.question_test_case_id}`, result]) ?? [],
  )

  const correctTestCases = props.question.testCases.filter((tc) => {
    const result = testResultByTestCaseId[tc.id]
    return result?.status === "success" && result.is_correct
  })

  const incorrectTestCases = props.question.testCases.filter((tc) => {
    const result = testResultByTestCaseId[tc.id]
    return result && (result.status === "error" || !result.is_correct)
  })

  const unsubmittedTestCases = props.question.testCases.filter((tc) => {
    return !testResultByTestCaseId[tc.id]
  })

  const sortedTestCases = [...unsubmittedTestCases, ...incorrectTestCases, ...correctTestCases]

  return (
    <div className="flex flex-col space-y-6 text-sm">
      {sortedTestCases.map((testCase, i) => {
        const result = props.testState?.results.find(
          (result) => result.question_test_case_id === testCase.id,
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

export default function CodeRunning() {
  const { gameInfo, gameSessionInfo, submitCodeMutation } = useGameManager()
  const submisisonMetricsQuery = api.games.getSubmissionMetrics.useQuery({
    game_id: gameSessionInfo.game_id,
  })
  const submissionMetrics = submisisonMetricsQuery.data
  const isComputingSubmission =
    submitCodeMutation.isPending && submitCodeMutation.variables.submission_type === "submission"
  const hasMetricsToShow =
    !isComputingSubmission && !submisisonMetricsQuery.isRefetching && submissionMetrics

  return (
    <div className="relative flex flex-col">
      <div className="flex-1">
        <div className="mb-4 flex items-center pb-2">
          <h3 className="flex-1 text-left text-lg font-bold">
            Test
            <br /> Cases
          </h3>
          <p className="text-right text-xs opacity-50">
            {gameSessionInfo.submission_state_id ? (
              <>
                <span>Last submssion</span>
                <br />
                <span className="inline-flex items-center gap-1 font-medium">
                  {hasMetricsToShow ? (
                    `${submissionMetrics.numPassingSubmissionsTestCases}/${submissionMetrics.numTestCases} `
                  ) : (
                    <Skeleton className="h-2 w-10 rounded-full" />
                  )}
                  testcases passed
                </span>
                {hasMetricsToShow ? (
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-red-500">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${(submissionMetrics.numPassingSubmissionsTestCases / submissionMetrics.numTestCases) * 100}%`,
                      }}
                    />
                  </div>
                ) : (
                  <Skeleton className="mt-1 h-2 w-full rounded-full" />
                )}
              </>
            ) : (
              <>
                <span>No submissions</span>
                <br />
                <span>recorded yet</span>
              </>
            )}
          </p>
        </div>
        {gameInfo.question ? (
          <QuestionTestCaseResults
            question={gameInfo.question}
            testState={gameSessionInfo.testState}
          />
        ) : null}
      </div>
    </div>
  )
}

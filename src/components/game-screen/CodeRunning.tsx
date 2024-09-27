import type { ReactNode } from "react"
import React from "react"
import { CheckCircle2, Loader2, MinusCircleIcon, Play, UploadCloud, XCircle } from "lucide-react"

import { type PlayerGameSession, type QuestionWithTestCases } from "~/lib/games/types"
import { api } from "~/lib/trpc/react"
import { Button } from "../ui/button"
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
              <Loader2 className="sq-6 animate-spin" />
            </span>
          )
        } else if (result) {
          testEmoji = (
            <span title={result.status === "success" ? "Test passed" : "Test failed"}>
              {result.status === "success" && result.is_correct ? (
                <CheckCircle2 className="s q-6 rounded-full bg-primary text-black" />
              ) : (
                <XCircle className="sq-6 rounded-full bg-red-500 text-black" />
              )}
            </span>
          )
        } else {
          testEmoji = (
            <span className="grayscale" title="No tests run">
              <MinusCircleIcon className="sq-6 rounded-full bg-primary text-black" />
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
  const utils = api.useUtils()
  const { gameInfo, gameSessionInfo, submitCodeMutation } = useGameManager()

  const handleRunTests = () => {
    utils.games.getPlayerGameSession.setData({ game_id: gameSessionInfo.game_id }, (oldData) =>
      oldData?.testState
        ? {
            ...oldData,
            testState: { ...oldData?.testState, status: "running" },
          }
        : undefined,
    )

    submitCodeMutation.mutate({ game_id: gameInfo.id, submission_type: "test-run" })
  }

  const handleSubmitCode = () => {
    utils.games.getPlayerGameSession.setData({ game_id: gameSessionInfo.game_id }, (oldData) =>
      oldData?.submissionState
        ? { ...oldData, submissionState: { ...oldData.submissionState, status: "running" } }
        : undefined,
    )

    submitCodeMutation.mutate({ game_id: gameInfo.id, submission_type: "submission" })
  }

  return (
    <div className="relative flex flex-col">
      <div className="mb-8 flex-1 overflow-scroll">
        <h3 className="mb-4 font-medium">Test cases</h3>
        {gameInfo.question ? (
          <QuestionTestCaseResults
            question={gameInfo.question}
            testState={gameSessionInfo.testState}
          />
        ) : null}
      </div>
      <div className="sticky bottom-0 flex justify-between">
        <Button
          onClick={handleRunTests}
          // TODO: we need to be checking gameSessionInfo.testState.status === "running" here
          // this way even if we leave and come back to this panel it will show its still runnning
          disabled={submitCodeMutation.isPending}
          isLoading={
            submitCodeMutation.isPending &&
            submitCodeMutation.variables.submission_type === "test-run"
          }
          Icon={Play}
          variant={"outline"}
          className="ring-2 ring-primary"
        >
          Run tests
        </Button>
        <Button
          onClick={handleSubmitCode}
          disabled={submitCodeMutation.isPending}
          isLoading={
            submitCodeMutation.isPending &&
            submitCodeMutation.variables.submission_type === "submission"
          }
          Icon={UploadCloud}
        >
          Submit code
        </Button>
      </div>
    </div>
  )
}

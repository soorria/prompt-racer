import React from "react"

import type { ClientQuestionStrategy } from "~/lib/games/question-types/base"
import { api } from "~/lib/trpc/react"
import { Skeleton } from "../ui/skeleton"
import { useGameManager } from "./GameManagerProvider"

export default function CodeRunning(props: { questionStrategy: ClientQuestionStrategy }) {
  const { gameSessionInfo, submitCodeMutation } = useGameManager()
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
          <h3 className="flex-1 text-left text-lg font-bold">Results</h3>
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
        {props.questionStrategy.results(gameSessionInfo.testState)}
      </div>
    </div>
  )
}

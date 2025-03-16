import { api } from "~/lib/trpc/react"
import { Skeleton } from "../../ui/skeleton"
import { useGameManager } from "../GameManagerProvider"

export function ProgrammingSubmissionStatus() {
  const { gameSessionInfo, submitCodeMutation } = useGameManager()
  const submisisonMetricsQuery = api.games.getProgrammingSubmissionMetrics.useQuery({
    game_id: gameSessionInfo.game_id,
  })
  const submissionMetrics = submisisonMetricsQuery.data
  const isComputingSubmission =
    submitCodeMutation.isPending && submitCodeMutation.variables.submission_type === "submission"
  const hasMetricsToShow =
    !isComputingSubmission && !submisisonMetricsQuery.isRefetching && submissionMetrics

  return (
    <p className="text-right text-xs opacity-50">
      {submissionMetrics?.submission_state_id ? (
        <>
          <span>Last submssion</span>
          <br />
          <span className="inline-flex items-center gap-1 font-medium">
            {hasMetricsToShow ? (
              `${submissionMetrics.metrics.numPassingSubmissionsTestCases}/${submissionMetrics.metrics.numTestCases} `
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
                  width: `${(submissionMetrics.metrics.numPassingSubmissionsTestCases / submissionMetrics.metrics.numTestCases) * 100}%`,
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
  )
}

import type { ProgrammingSubmissionState } from "~/lib/games/types"
import { Skeleton } from "../ui/skeleton"

export function ProgrammingSubmissionStatus(props: {
  submissionState: ProgrammingSubmissionState
}) {
  const hasMetricsToShow = true
  return (
    <p className="text-right text-xs opacity-50">
      {props.submissionState.submission_state_id ? (
        <>
          <span>Last submssion</span>
          <br />
          <span className="inline-flex items-center gap-1 font-medium">
            {hasMetricsToShow ? (
              `${props.submissionState.metrics.numPassingSubmissionsTestCases}/${props.submissionState.metrics.numTestCases} `
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
                  width: `${(props.submissionState.metrics.numPassingSubmissionsTestCases / props.submissionState.metrics.numTestCases) * 100}%`,
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

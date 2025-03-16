"use client"

import React from "react"
import { Play, UploadCloud } from "lucide-react"

import { api } from "~/lib/trpc/react"
import { Button } from "../../ui/button"
import { useGameManager } from "../GameManagerProvider"

export default function ProgrammingCodeRunningFooter() {
  const utils = api.useUtils()
  const { gameInfo, gameSessionInfo, submitCodeMutation, isGeneratingCode } = useGameManager()
  const submisisonMetricsQuery = api.games.getProgrammingSubmissionMetrics.useQuery({
    game_id: gameSessionInfo.game_id,
  })
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

    submitCodeMutation.mutate(
      { game_id: gameInfo.id, submission_type: "submission" },
      {
        onSuccess: () => {
          void submisisonMetricsQuery.refetch()
        },
      },
    )
  }

  const isComputingTestRun =
    submitCodeMutation.isPending && submitCodeMutation.variables.submission_type === "test-run"
  const isComputingSubmission =
    submitCodeMutation.isPending && submitCodeMutation.variables.submission_type === "submission"

  return (
    <div className="flex justify-between">
      <Button
        onClick={handleRunTests}
        // TODO: we need to be checking gameSessionInfo.testState.status === "running" here
        // this way even if we leave and come back to this panel it will show its still runnning
        disabled={submitCodeMutation.isPending || isGeneratingCode}
        isLoading={isComputingTestRun}
        Icon={Play}
        variant={"outline"}
        className="ring-2 ring-primary"
      >
        Run tests
      </Button>
      <Button
        onClick={handleSubmitCode}
        disabled={submitCodeMutation.isPending || isGeneratingCode}
        isLoading={isComputingSubmission}
        Icon={UploadCloud}
      >
        Submit code
      </Button>
    </div>
  )
}

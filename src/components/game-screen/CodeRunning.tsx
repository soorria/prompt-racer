import type { ReactNode } from "react"
import React from "react"
import {
  CheckCircle2,
  CornerDownRightIcon,
  Loader2,
  MinusCircleIcon,
  Play,
  UploadCloud,
  XCircle,
} from "lucide-react"
import { useAction } from "next-safe-action/hooks"

import { submitCodeAction } from "~/lib/games/actions"
import { Button } from "../ui/button"
import { useGameManager } from "./GameManagerProvider"

export default function CodeRunning() {
  const { gameInfo, gameSessionInfo } = useGameManager()
  const runTestAction = useAction(submitCodeAction)
  const submitCode = useAction(submitCodeAction)

  return (
    <div>
      <div className="mb-4">
        <h3 className="mb-2 font-medium">Test cases</h3>
        <div className="space-y-2 text-sm">
          {gameInfo.question.testCases.map((testCase, i) => {
            const result = gameSessionInfo.testState?.results[i]
            let testEmoji: ReactNode
            if (gameSessionInfo.testState?.status === "running") {
              testEmoji = (
                <span title="Running test">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </span>
              )
            } else if (result) {
              testEmoji = (
                <span title={result.status === "success" ? "Test passed" : "Test failed"}>
                  {result.status === "success" && result.is_correct ? (
                    <CheckCircle2 className="h-6 w-6 rounded-full bg-primary text-black" />
                  ) : (
                    <XCircle className="h-6 w-6 rounded-full bg-red-500 text-black" />
                  )}
                </span>
              )
            } else {
              testEmoji = (
                <span className="grayscale" title="No tests run">
                  <MinusCircleIcon className="h-6 w-6 rounded-full bg-primary text-black" />
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
                {result?.status === "error" && (
                  <div className="grid gap-1" style={{ gridTemplateColumns: "1em 1fr" }}>
                    <span className="justify-self-center">
                      <CornerDownRightIcon className="ml-4 h-4 w-4 text-red-500" />
                    </span>
                    <span className="ml-4">
                      {result.status === "error" ? `${result.reason}` : null}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <div className="flex justify-between">
        <Button
          onClick={() =>
            runTestAction.execute({ game_id: gameInfo.id, submission_type: "test-run" })
          }
          // TODO: we need to be checking gameSessionInfo.testState.status === "running" here
          // this way even if we leave and come back to this panel it will show its still runnning
          disabled={submitCode.isExecuting || runTestAction.isExecuting}
          isLoading={runTestAction.isExecuting}
          Icon={Play}
          variant={"outline"}
        >
          Run tests
        </Button>
        <Button
          onClick={() =>
            submitCode.execute({ game_id: gameInfo.id, submission_type: "submission" })
          }
          disabled={submitCode.isExecuting || runTestAction.isExecuting}
          isLoading={submitCode.isExecuting}
          Icon={UploadCloud}
        >
          Submit code
        </Button>
      </div>
    </div>
  )
}

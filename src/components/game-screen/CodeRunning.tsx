import React, { ReactNode } from "react"
import { CheckCircle2, CornerDownRightIcon, Loader2, MinusCircleIcon, XCircle } from "lucide-react"

import { submitCodeAction } from "~/lib/games/actions"
import { Button } from "../ui/button"
import { useGameManager } from "./GameManagerProvider"

export default function CodeRunning() {
  const context = useGameManager()
  console.log(context.gameSessionInfo.testState)

  return (
    <div>
      <div className="mt-6 rounded bg-primary/40 px-3 py-2">
        <h3 className="mb-2 font-medium">Win condition</h3>
        <p className="text-sm">{context.gameInfo.mode}</p>
      </div>

      <div className="mb-4 mt-12">
        <h3 className="mb-2 font-medium">Test cases</h3>
        <div className="space-y-2 text-sm">
          {context.gameInfo.question.testCases.map((testCase, i) => {
            const result = context.gameSessionInfo.testState?.results[i]
            let testEmoji: ReactNode
            if (context.gameSessionInfo.testState?.status === "running") {
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
      <div className="flex">
        <Button
          onClick={async () => {
            const result = await submitCodeAction({
              game_id: context.gameInfo.id,
              submission_type: "test-run",
            })
          }}
          isLoading={context.gameSessionInfo.testState?.status === "running"}
        >
          Test run code
        </Button>
        <Button
          onClick={async () => {
            const result = await submitCodeAction({
              game_id: context.gameInfo.id,
              submission_type: "submission",
            })
          }}
          isLoading={context.gameSessionInfo.submissionState?.status === "running"}
        >
          Submit code
        </Button>
      </div>
    </div>
  )
}

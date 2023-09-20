import React, { ReactNode } from "react"
import { Button } from "~/components/ui/button"
import { Doc } from "~convex/dataModel"

type Props = {
  gameMode: Doc<"game">["mode"]
  question: Doc<"game">["question"]
  playerGameInfo: Doc<"playerGameInfo"> | null | undefined
  onRunTests: () => void
}

export default function DescriptionPanel({
  question,
  gameMode,
  playerGameInfo,
  onRunTests,
}: Props) {
  const testsRunning = playerGameInfo?.testState?.type === "running"
  const testResults =
    playerGameInfo?.testState?.type === "complete" ? playerGameInfo.testState.results : []

  const errors = testResults.flatMap((result) => (result.status === "error" ? result.reason : []))

  return (
    <div className="bg-card h-full rounded-xl p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">{question.title}</h2>
      <p>{question.description}</p>

      <div className="bg-primary/40 px-3 py-2 mt-6 rounded">
        <h3 className="font-medium mb-2">Win condition</h3>
        <p className="text-sm">{gameMode}</p>
      </div>

      <div className="mt-12">
        <h3 className="font-medium mb-2">Test cases</h3>
        <div className="space-y-2 text-sm">
          {question.examples.map((testCase, i) => {
            const result = testResults[i]
            let testEmoji: ReactNode
            if (!playerGameInfo) {
              testEmoji = null
            } else if (testsRunning) {
              testEmoji = <span title="Running test">🏃‍♂️</span>
            } else if (result) {
              testEmoji = (
                <span title={result.status === "success" ? "Test passed" : "Test failed"}>
                  {result.status === "success" ? "✅" : "❌"}
                </span>
              )
            } else {
              testEmoji = (
                <span className="grayscale" title="No tests run">
                  ✅
                </span>
              )
            }
            return (
              <div key={i} className="font-mono whitespace-pre-wrap">
                <div className="grid gap-1" style={{ gridTemplateColumns: "1em 1fr" }}>
                  <span className="justify-self-center">{testEmoji}</span>
                  <span>
                    solution({testCase.args.map((a) => JSON.stringify(a)).join(", ")}) =={" "}
                    {JSON.stringify(testCase.expected)}
                  </span>
                </div>
                {result?.status === "error" && (
                  <div className="grid gap-1" style={{ gridTemplateColumns: "1em 1fr" }}>
                    <span className="justify-self-center">↳</span>
                    {result.status === "error"
                      ? `${result.reason.name}: ${result.reason.message}`
                      : null}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        {playerGameInfo && (
          <div className="mt-4 sticky bottom-0 flex justify-between">
            <Button size="sm" onClick={onRunTests} disabled={testsRunning}>
              Run tests
            </Button>

            <Button size="sm" onClick={onRunTests} disabled={testsRunning}>
              Submit code
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

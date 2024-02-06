import { CheckCircle2, CornerDownRightIcon, Loader2, MinusCircleIcon, XCircle } from "lucide-react"
import React, { ReactNode, useState } from "react"
import { Button } from "~/components/ui/button"
import { Doc } from "~convex/dataModel"
import { GAME_TIMINGS_MS } from "../../convex/utils/game_settings"
import { addMilliseconds, formatDuration, intervalToDuration, isAfter, isEqual } from "date-fns"
import { Tooltip, TooltipContent } from "./ui/tooltip"
import { TooltipTrigger } from "@radix-ui/react-tooltip"
import { useNow } from "~/lib/use-now"

type Props = {
  gameMode: Doc<"game">["mode"]
  question: Doc<"game">["question"]
  playerGameInfo: Doc<"playerGameInfo"> | null | undefined
  onRunTests: () => void
  onSubmitCode: () => void
}

const winConditionDescriptions: Record<Doc<"game">["mode"], string> = {
  "fastest-player": "The first player to submit code that passes all tests wins.",
  "fastest-code": "The player whose code passes the most tests and runs the fastest wins.",
  "shortest-code":
    "The player whose code passes the most tests and has the fewest characters wins.",
  "shortest-messages-word-length":
    "The player whose code passes the most tests and has the fewest characters in their messages wins. Note: this count does not reset when you reset your code!",
}

const timingCheck = (
  now: Date,
  lastRunAt: number | null | undefined
): { canRun: true } | { canRun: false; timeLeft: string } => {
  const lastRun = lastRunAt ? new Date(lastRunAt) : null

  if (!lastRun) return { canRun: true }

  const runnableAt = addMilliseconds(lastRun, GAME_TIMINGS_MS.promptRateLimitTime)

  const canRun = isAfter(now, runnableAt) || isEqual(now, runnableAt)

  if (canRun) {
    return { canRun: true }
  }
  return {
    canRun: false,
    timeLeft: formatDuration(
      intervalToDuration({
        start: now,
        end: runnableAt,
      }),
      {
        format: ["seconds"],
      }
    ),
  }
}

export default function DescriptionPanel({
  question,
  gameMode,
  playerGameInfo,
  onRunTests,
  onSubmitCode,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const testsRunning = playerGameInfo?.testState?.type === "running"
  const testResults =
    playerGameInfo?.testState?.type === "complete" ? playerGameInfo.testState.results : []

  const now = useNow()

  const testTiming = timingCheck(now, playerGameInfo?.lastTestedAt)
  console.log({
    testTiming,
    now,
    testedAt: playerGameInfo?.lastTestedAt,
  })
  const submitTiming = timingCheck(now, playerGameInfo?.lastSubmittedAt)

  const handleSubmission = async () => {
    setIsSubmitting(true)
    await onSubmitCode()
    setIsSubmitting(false)
  }

  return (
    <div className="bg-card h-full rounded-xl p-4 overflow-y-auto select-none">
      <h2 className="text-lg font-semibold mb-4">{question.title}</h2>
      <p>{question.description}</p>

      <div className="bg-primary/40 px-3 py-2 mt-6 rounded">
        <h3 className="font-medium mb-2">Win condition</h3>
        <p className="text-sm">{winConditionDescriptions[gameMode]}</p>
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
              testEmoji = (
                <span title="Running test">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </span>
              )
            } else if (result) {
              testEmoji = (
                <span title={result.status === "success" ? "Test passed" : "Test failed"}>
                  {result.status === "success" ? (
                    <CheckCircle2 className="w-6 h-6 rounded-full text-black bg-primary" />
                  ) : (
                    <XCircle className="w-6 h-6 rounded-full text-black bg-red-500" />
                  )}
                </span>
              )
            } else {
              testEmoji = (
                <span className="grayscale" title="No tests run">
                  <MinusCircleIcon className="w-6 h-6 rounded-full text-black bg-primary" />
                </span>
              )
            }
            return (
              <div key={i} className="font-mono whitespace-pre-wrap">
                <div className="flex items-center gap-2">
                  <span className="justify-self-center">{testEmoji}</span>
                  <span>
                    solution({testCase.args.map((a) => JSON.stringify(a)).join(", ")}) =={" "}
                    {JSON.stringify(testCase.expected)}
                  </span>
                </div>
                {result?.status === "error" && (
                  <div className="grid gap-1" style={{ gridTemplateColumns: "1em 1fr" }}>
                    <span className="justify-self-center">
                      <CornerDownRightIcon className="ml-4 w-4 h-4 text-red-500" />
                    </span>
                    <span className="ml-4">
                      {result.status === "error"
                        ? `${result.reason.name}: ${result.reason.message}`
                        : null}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        {playerGameInfo && (
          <div className="mt-8 sticky bottom-0 flex justify-between items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    size="sm"
                    onClick={onRunTests}
                    disabled={testsRunning || isSubmitting || !testTiming.canRun}
                  >
                    Run tests
                  </Button>
                </span>
              </TooltipTrigger>

              <TooltipContent>
                {testsRunning ? (
                  <p>Running tests...</p>
                ) : isSubmitting ? (
                  <p>pls wait until code submission done :)</p>
                ) : testTiming.canRun ? null : (
                  <p>Wait {testTiming.timeLeft}</p>
                )}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    size="sm"
                    onClick={handleSubmission}
                    disabled={testsRunning || isSubmitting || !submitTiming.canRun}
                  >
                    {isSubmitting && <Loader2 className="w-6 h-6 animate-spin mr-1" />}
                    Submit code
                  </Button>
                </span>
              </TooltipTrigger>

              <TooltipContent>
                {testsRunning ? (
                  <p>pls wait until tests done :)</p>
                ) : isSubmitting ? (
                  <p>Submitting code...</p>
                ) : submitTiming.canRun ? null : (
                  <p>Wait {submitTiming.timeLeft}</p>
                )}
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  )
}

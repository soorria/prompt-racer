"use client"

import React from "react"
import { TestTubeDiagonal } from "lucide-react"
import Markdown from "react-markdown"

import type { GameMode, GameModeDetailsItem } from "~/lib/games/constants"
import type { QuestionWithTestCases } from "~/lib/games/types"
import { Badge } from "~/components/ui/badge"
import { GAME_MODE_DETAILS } from "~/lib/games/constants"
import { DifficultyToBadgeVariantMap } from "~/lib/games/types"
import { cn } from "~/lib/utils"

export default function QuestionDescription(props: {
  question: QuestionWithTestCases
  gameMode: GameMode
}) {
  return (
    <div>
      <div className="mb-1 text-2xl font-bold">{props.question.title}</div>
      <Badge variant={DifficultyToBadgeVariantMap[props.question.difficulty]} className="mb-2">
        {props.question.difficulty}
      </Badge>
      <WinConditionCard mode={GAME_MODE_DETAILS[props.gameMode]} />
      <div className="text-pretty text-sm">
        <Markdown className={"prose prose-invert"}>{props.question.description}</Markdown>
      </div>

      <div>
        <div className="mb-4 mt-8">
          <h3 className="mb-2 font-medium">Test cases</h3>
          <div className="space-y-2 text-sm">
            {props.question.testCases.map((testCase, i) => (
              <div key={i} className="whitespace-pre-wrap font-mono">
                <div className="flex items-center gap-2">
                  <span className="justify-self-center">
                    <TestTubeDiagonal />
                  </span>
                  <span>
                    solution({testCase.args.map((a) => JSON.stringify(a)).join(", ")}) =={" "}
                    {JSON.stringify(testCase.expectedOutput)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const WinConditionCard = ({ mode }: { mode: GameModeDetailsItem }) => {
  return (
    <div
      className={cn(
        "relative my-4 flex w-full max-w-prose flex-col overflow-hidden rounded-2xl p-3 @container",
      )}
      style={{
        backgroundColor: mode.color,
        boxShadow: "inset 0 0 0 1000px rgba(0,0,0,0.7)",
      }}
    >
      <div className="absolute right-3 top-3 hidden rounded-full bg-black/30 px-2 py-0.5 text-xs font-medium @[200px]:block">
        Win condition
      </div>

      <div className="mb-2 flex items-center gap-2">
        <mode.icon className="hidden h-4 w-4 @sm:block" />
        <h2 className="@sm:text-md text-sm font-medium">{mode.title}</h2>
      </div>
      <p className="text-sm">{mode.description}</p>
    </div>
  )
}

"use client"

import React from "react"
import { TestTubeDiagonal } from "lucide-react"
import Markdown from "react-markdown"

import type { GameMode } from "~/lib/games/constants"
import type { QuestionWithTestCases } from "~/lib/games/types"
import { Badge } from "~/components/ui/badge"
import { GAME_MODE_DETAILS } from "~/lib/games/constants"
import { MapfromDifficultyToBadgeVariant } from "~/lib/games/types"

export default function QuestionDescription(props: {
  question: QuestionWithTestCases
  gameMode: GameMode
}) {
  return (
    <div>
      <div className="mb-1 text-2xl font-bold">{props.question.title}</div>
      <Badge variant={MapfromDifficultyToBadgeVariant[props.question.difficulty]} className="mb-2">
        {props.question.difficulty}
      </Badge>
      <div className="mb-6 mt-3 rounded bg-primary/40 px-3 py-2">
        <h3 className="mb-2 font-medium">Win condition</h3>
        <p className="text-sm">{GAME_MODE_DETAILS[props.gameMode].description}</p>
      </div>
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

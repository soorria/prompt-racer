"use client"

import React from "react"
import { TestTubeDiagonal } from "lucide-react"
import Markdown from "react-markdown"

import type { QuestionWithTestCases } from "~/lib/games/types"
import { Badge } from "~/components/ui/badge"
import { type Doc } from "~/lib/db/types"
import { type GameMode } from "~/lib/games/constants"

const MapfromDifficultyToBadgeVariant = {
  easy: "green",
  medium: "yellow",
  hard: "red",
} satisfies Record<Doc<"questions">["difficulty"], "green" | "yellow" | "red">

const MapFromModeToWinConditionDescription = {
  "fastest-player": "The fastest player to submit the correct answer wins!",
  "fastest-code": "The code that runs the fastest wins!",
  "shortest-code": "The fewest amount of lines/characters of code wins!",
  "fewest-characters-to-llm": "The fewest characters able to generate the correct answer wins!",
} satisfies Record<Doc<"gameStates">["mode"], string>

export default function QuestionDescription(props: {
  question: QuestionWithTestCases
  gameMode: GameMode
}) {
  return (
    <div className="pb-16">
      <div className="mb-1 text-2xl font-bold">{props.question.title}</div>
      <Badge variant={MapfromDifficultyToBadgeVariant[props.question.difficulty]} className="mb-2">
        {props.question.difficulty}
      </Badge>
      <div className="mb-6 mt-3 rounded bg-primary/40 px-3 py-2">
        <h3 className="mb-2 font-medium">Win condition</h3>
        <p className="text-sm">{MapFromModeToWinConditionDescription[props.gameMode]}</p>
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

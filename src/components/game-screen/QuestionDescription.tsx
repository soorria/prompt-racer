"use client"

import React from "react"
import { TestTubeDiagonal } from "lucide-react"
import Markdown from "react-markdown"

import { Badge } from "~/components/ui/badge"
import { type Doc } from "~/lib/db/types"
import { useGameManager } from "./GameManagerProvider"

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

export default function QuestionDescription() {
  const { gameInfo } = useGameManager()

  return (
    <div className="pb-16">
      <div className="mb-1 text-2xl font-bold">{gameInfo.question.title}</div>
      <Badge
        variant={MapfromDifficultyToBadgeVariant[gameInfo.question.difficulty]}
        className="mb-5"
      >
        {gameInfo.question.difficulty}
      </Badge>
      <div className="my-6 rounded bg-primary/40 px-3 py-2">
        <h3 className="mb-2 font-medium">Win condition</h3>
        <p className="text-sm">{MapFromModeToWinConditionDescription[gameInfo.mode]}</p>
      </div>
      <div className="text-pretty text-sm">
        <Markdown className={"prose prose-invert"}>{gameInfo.question.description}</Markdown>
      </div>

      <div>
        <h3 className="mb-2 font-medium">Examples</h3>
        <div className="mb-4 mt-12">
          <h3 className="mb-2 font-medium">Test cases</h3>
          <div className="space-y-2 text-sm">
            {gameInfo.question.testCases.map((testCase, i) => (
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

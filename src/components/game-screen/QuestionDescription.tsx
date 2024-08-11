"use client"

import React from "react"
import Markdown from "react-markdown"

import { Badge } from "~/components/ui/badge"
import CodeRunning from "./CodeRunning"
import { useGameManager } from "./GameManagerProvider"

const MapfromDifficultyToBadgeVariant = {
  easy: "green",
  medium: "yellow",
  hard: "red",
} as const

export default function QuestionDescription() {
  const { gameInfo } = useGameManager()

  return (
    <>
      <div className="mb-1 text-2xl font-bold">{gameInfo.question.title}</div>
      <Badge
        variant={MapfromDifficultyToBadgeVariant[gameInfo.question.difficulty]}
        className="mb-5"
      >
        {gameInfo.question.difficulty}
      </Badge>
      <div className="text-pretty text-sm">
        <Markdown className={"prose prose-invert"}>{gameInfo.question.description}</Markdown>
      </div>
      <CodeRunning />
    </>
  )
}

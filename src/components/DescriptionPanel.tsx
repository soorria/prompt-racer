import React from "react"
import { Doc } from "~convex/dataModel"

type Props = {
  question: Doc<"game">["question"]
}

export default function DescriptionPanel({ question }: Props) {
  return (
    <div className="bg-card h-full rounded-xl grid place-content-center p-4">
      {question.description}
    </div>
  )
}

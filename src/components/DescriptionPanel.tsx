import React from "react"
import { QuestionType } from "./PanelSkeleton"

type Props = {
  question: QuestionType
}

export default function DescriptionPanel({ question }: Props) {
  return (
    <div className="bg-card h-full rounded-xl grid place-content-center">
      {question.description}
    </div>
  )
}

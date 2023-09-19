import React from "react"
import { Doc } from "~convex/dataModel"

type Props = {
  gameMode: Doc<"game">["mode"]
  question: Doc<"game">["question"]
}

export default function DescriptionPanel({ question, gameMode }: Props) {
  return (
    <div className="bg-card h-full rounded-xl grid place-content-center p-4">
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
            return (
              <div key={i} className="font-mono">
                solution({testCase.args.map((a) => JSON.stringify(a)).join(", ")}) =={" "}
                {JSON.stringify(testCase.expected)}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

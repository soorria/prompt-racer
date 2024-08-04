"use client"

import React from "react"

import { useGameManager } from "../GameManagerContext"

const fakePythonCodeSnippet = `def solution(nums, target):
    indexes = {}
    for i, n in enumerate(nums):
        if n in indexes:
            return indexes[n], i, return indexes[n], i, return indexes[n], i
        else:
            indexes[target - n] = i
    return None, None`

export default function QuestionDescription() {
  const context = useGameManager()

  return (
    <div>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
      galley of type and scrambled it to make a type specimen book. It has survived not only five
      galley of type and scrambled it to make a type specimen book. It has survived not only five
      galley of type and scrambled it to make a type specimen book. It has survived not only five
      galley of type and scrambled it to make a type specimen book. It has survived not only five
      galley of type and scrambled it to make a type specimen book. It has survived not only five
      galley of type and scrambled it to make a type specimen book. It has survived not only five
      galley of type and scrambled it to make a type specimen book. It has survived not only five
      galley of type and scrambled it to make a type specimen book. It has survived not only five
      centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It
      was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
      passages, and more recently with desktop publishing software like Aldus PageMaker including
      versions of Lorem Ipsum.
      <button onClick={() => context.insertChatHistoryItem(fakePythonCodeSnippet)}>Submit</button>
    </div>
  )
}

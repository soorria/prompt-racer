"use client"

import React, { useState } from "react"

import { GameManagerContext } from "./GameManagerContext"

const fakePythonCodeSnippet = `def solution(nums, target):
    indexes = {}
    for i, n in enumerate(nums):
        if n in indexes:
            return indexes[n], i, return indexes[n], i, return indexes[n], i
        else:
            indexes[target - n] = i
    return None, None`
export function GameManagerProvider({ children }: { children: React.ReactNode }) {
  const [code, setCode] = useState<string>(fakePythonCodeSnippet)
  const [chatHistory, setChatHistory] = useState<string[]>([])

  const updateCurrentCode = (code: string) => {
    setCode(code)
    setChatHistory([...chatHistory, code])
  }

  const insertChatHistoryItem = (code: string) => {
    setCode(code)
    setChatHistory([...chatHistory, code])
  }

  return (
    <GameManagerContext.Provider
      value={{ chatHistory, insertChatHistoryItem, code, updateCurrentCode }}
    >
      {children}
    </GameManagerContext.Provider>
  )
}

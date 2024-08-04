"use client"

import { createContext, useContext } from "react"

import { noop } from "~/lib/utils"

type GameManagerContextType = {
  code: string
  chatHistory: string[]
  insertChatHistoryItem: (code: string) => void
  updateCurrentCode: (code: string) => void
}

const gameManagerDefaultValue = {
  code: "",
  chatHistory: [],
  insertChatHistoryItem: noop,
  updateCurrentCode: noop,
}

export const GameManagerContext = createContext<GameManagerContextType>(gameManagerDefaultValue)

export function useGameManager() {
  return useContext(GameManagerContext)
}

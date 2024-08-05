"use client"

import React from "react"

import CodeRenderer from "../../CodeRenderer"
import { useGameManager } from "../GameManagerContext"

export default function CodeView({ code }: { code?: string }) {
  const context = useGameManager()
  return <CodeRenderer code={context.code ?? code} language="python" showLineNumbers />
}

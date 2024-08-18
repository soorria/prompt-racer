"use client"

import React from "react"
import { Send } from "lucide-react"

import CodeRenderer from "../CodeRenderer"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useGameManager } from "./GameManagerProvider"

export default function CodeView() {
  const context = useGameManager()

  return (
    <div>
      <CodeRenderer code={context.gameSessionInfo.code} language="python" showLineNumbers />
      <form
        className="absolute inset-x-2 bottom-2 flex gap-2"
        action={async (formData) => {
          await context.updateCurrentCodeMutation.mutateAsync(formData.get("message") as string)
        }}
      >
        <Input className="flex-1" name="message" placeholder="Enter your instructions" />
        <Button isLoading={context.updateCurrentCodeMutation.isPending} Icon={Send}>
          Send
        </Button>
      </form>
    </div>
  )
}

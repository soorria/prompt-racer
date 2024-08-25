"use client"

import { useRef } from "react"
import { Send } from "lucide-react"

import CodeRenderer from "../CodeRenderer"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useGameManager } from "./GameManagerProvider"

export default function CodeView() {
  const context = useGameManager()
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <div>
      <CodeRenderer code={context.gameSessionInfo.code} language="python" showLineNumbers />
      <form
        ref={formRef}
        className="absolute inset-x-2 bottom-2 flex gap-2"
        action={async (formData) => {
          await context.updateCurrentCodeMutation.mutateAsync(formData.get("message") as string)
          formRef.current?.reset()
        }}
      >
        <Input className="flex-1 rounded-lg" name="message" placeholder="Enter your instructions" />
        <Button
          type="submit"
          className="rounded-lg"
          isLoading={context.updateCurrentCodeMutation.isPending}
          Icon={Send}
        >
          Send
        </Button>
      </form>
    </div>
  )
}

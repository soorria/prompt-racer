"use client"

import { useRef, useState } from "react"
import { Send } from "lucide-react"

import CodeRenderer from "../CodeRenderer"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useGameManager } from "./GameManagerProvider"

export const CodeViewImpl = {
  key: "code",
  className: "bg-dracula p-2 sm:p-4 flex flex-col",
  component: <CodeView />,
}

export default function CodeView() {
  const context = useGameManager()
  const formRef = useRef<HTMLFormElement>(null)
  const [inputValue, setInputValue] = useState("")

  const maxLength = 50
  const widthPercentage = (inputValue.length / maxLength) * 100

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  return (
    <>
      <CodeRenderer
        code={context.gameSessionInfo.code}
        language="python"
        preProps={{ className: "py-0 sm:py-2 mb-4" }}
        codeProps={{ className: "pr-0 p-2 sm:p-0" }}
        showLineNumbers={!context.isMobile}
        isGeneratingCode={context.isGeneratingCode}
      />

      <form
        ref={formRef}
        className="sticky inset-x-0 bottom-0 flex shrink-0 gap-2"
        onSubmit={async (e) => {
          e.preventDefault()
          await context.updateCurrentCodeMutation.mutateAsync(inputValue)
          setInputValue("")
        }}
      >
        <div className="relative flex-1 overflow-hidden rounded-lg">
          <Input
            className="flex-1 rounded-lg"
            maxLength={maxLength}
            disabled={context.isGeneratingCode || context.updateCurrentCodeMutation.isPending}
            name="message"
            placeholder="Enter your instructions"
            value={inputValue}
            onChange={handleChange}
          />
          <div
            className="absolute bottom-0 h-1 rounded-lg bg-primary/75"
            style={{ width: `${widthPercentage}%` }}
          ></div>
        </div>
        <Button
          type="submit"
          className="rounded-lg px-2"
          isLoading={context.updateCurrentCodeMutation.isPending}
          Icon={!context.isMobile ? Send : undefined}
        >
          {context.isMobile && <Send className="h-5 w-5" />}
          {!context.isMobile && <>Send</>}
        </Button>
      </form>
    </>
  )
}

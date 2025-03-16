"use client"

import { useRef, useState } from "react"
import { Send } from "lucide-react"

import { MAX_SEND_MESSAGE_CHARACTER_LIMIT } from "~/lib/games/constants"
import CodeRenderer from "../CodeRenderer"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useGameManager } from "./GameManagerProvider"

export default function CodeView() {
  const context = useGameManager()
  const formRef = useRef<HTMLFormElement>(null)
  const [inputValue, setInputValue] = useState("")

  const maxLength = MAX_SEND_MESSAGE_CHARACTER_LIMIT
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
        {!context.isMobile && widthPercentage === 100 && (
          <div className="slide-in-direct absolute -bottom-4 left-0 right-0 z-50 mx-auto text-center text-xs text-zinc-500">
            {maxLength} character limit reached
          </div>
        )}
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
            className="absolute bottom-0 h-1 rounded-lg bg-gradient-to-r from-primary/75 to-red-500 transition-all"
            style={{
              width: `${widthPercentage}%`,
              "--tw-gradient-from-position": `${165 - widthPercentage}%`,
            }}
          ></div>
        </div>
        <Button
          type="submit"
          className="rounded-lg px-2"
          isLoading={context.updateCurrentCodeMutation.isPending || context.isGeneratingCode}
          Icon={context.isMobile ? Send : undefined}
        >
          {!context.isMobile && (
            <>
              <Send className="mr-1 sq-4" />
              Send
            </>
          )}
        </Button>
      </form>
    </>
  )
}

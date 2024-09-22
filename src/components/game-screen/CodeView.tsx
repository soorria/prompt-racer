"use client"

import { useRef } from "react"
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

  return (
    <>
      <CodeRenderer
        code={context.gameSessionInfo.code}
        language="python"
        preProps={{ className: "py-0 sm:py-2" }}
        codeProps={{ className: "pr-0 p-2 sm:p-0" }}
        showLineNumbers={!context.isMobile}
        isGeneratingCode={context.isGeneratingCode}
      />

      <form
        ref={formRef}
        className="sticky inset-x-0 bottom-0 flex shrink-0 gap-2"
        action={async (formData) => {
          await context.updateCurrentCodeMutation.mutateAsync(formData.get("message") as string)
          formRef.current?.reset()
        }}
      >
        <Input className="flex-1 rounded-lg" name="message" placeholder="Enter your instructions" />
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

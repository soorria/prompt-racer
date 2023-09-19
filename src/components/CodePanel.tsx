import React, { useEffect, useRef } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { python } from "@codemirror/lang-python"
import { dracula } from "@uiw/codemirror-theme-dracula"
import { AiMessageType } from "./PanelSkeleton"
import clsx from "clsx"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { Send } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

type Props = {
  code?: AiMessageType
  onMessageSend: (message: string) => void
  sending?: boolean
}

const defaultCode = `
def solution(numbers, target):
    ...
`

export default function CodePanel({ code, onMessageSend, sending }: Props) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [animateRef] = useAutoAnimate()
  const generating = code?.parsed?.state === "generating"
  const previousGenerating = useRef<boolean>(false)
  const form = useRef<HTMLFormElement>(null)

  useEffect(() => {
    previousGenerating.current = generating
  }, [generating])

  useEffect(() => {
    if (!sending) {
      form.current?.reset()
    }
  }, [sending])

  let codeToDisplay = ""
  if (code) {
    if (code.parsed.state === "success") {
      codeToDisplay = code.parsed.code
    } else if (code.parsed.state === "generating") {
      codeToDisplay = codeToDisplay = code.parsed.maybeCode
    } else if (code.parsed.state === "error") {
      codeToDisplay = code.parsed.error
    } else {
      codeToDisplay = defaultCode
    }
  }
  return (
    <div
      className={clsx("rounded-xl overflow-y-scroll h-full bg-dracula flex flex-col", {
        "animate-pulse": code?.parsed.state === "generating",
      })}
      ref={animateRef}
    >
      <div className="flex-1">
        <CodeMirror
          // @ts-ignore TODO: it doesn't understand the ref is actually on a div not sure how to fix rn
          ref={contentRef}
          data-gramm="false"
          data-gramm_editor="false"
          data-enable-grammarly="false"
          editable={false}
          value={codeToDisplay + "\n" + codeToDisplay}
          extensions={[python()]}
          theme={dracula}
        />
      </div>
      <div className="flex sticky bottom-2 px-2 pt-4">
        <form
          ref={form}
          className="flex w-full items-center space-x-2"
          onSubmit={(event) => {
            event.preventDefault()
            const message = new FormData(event.currentTarget).get("message")
            if (typeof message === "string" && message) {
              onMessageSend(message)
            }
          }}
        >
          <Input
            id="message"
            name="message"
            placeholder="Type your instructions..."
            autoComplete="off"
            required
            disabled={sending}
            maxLength={80}
          />
          <Button type="submit" disabled={sending} size="icon" className="shrink-0">
            <Send className="w-5 h-5" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  )
}

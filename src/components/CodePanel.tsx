import React, { useEffect, useRef } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { python } from "@codemirror/lang-python"
import { dracula } from "@uiw/codemirror-theme-dracula"
import { AiMessageType } from "./PanelSkeleton"
import clsx from "clsx"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { Send } from "lucide-react"

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
      className={clsx("bg-card rounded-xl overflow-y-scroll h-full ", {
        "animate-pulse": code?.parsed.state === "generating",
      })}
      style={{ backgroundColor: "var(--d-background)" }}
      ref={animateRef}
    >
      <CodeMirror
        // @ts-ignore TODO: it doesn't understand the ref is actually on a div not sure how to fix rn
        ref={contentRef}
        data-gramm="false"
        data-gramm_editor="false"
        data-enable-grammarly="false"
        editable={false}
        value={codeToDisplay}
        extensions={[python()]}
        theme={dracula}
      />
      <div className="flex px-2 py-4 absolute bottom-0 left-0 right-0">
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
          <input
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
            id="message"
            name="message"
            placeholder="Type your instructions..."
            autoComplete="off"
            required
            disabled={sending}
          />
          <button
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-10"
            type="submit"
            disabled={sending}
          >
            <Send className="w-5 h-5" />
            <span className="sr-only">Send</span>
          </button>
        </form>
      </div>
    </div>
  )
}

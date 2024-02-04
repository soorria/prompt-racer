import React, { useEffect, useState, useRef } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { python } from "@codemirror/lang-python"
import { dracula } from "@uiw/codemirror-theme-dracula"
import clsx from "clsx"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { Send, RotateCcw } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

function useMounted() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    return () => setMounted(false)
  }, [])

  return mounted
}

type Props = {
  code: string
  onMessageSend: (message: string) => void
  onResetCode: () => void
  sending?: boolean
  generating?: boolean
}

export default function CodePanel({
  code,
  onMessageSend,
  sending,
  generating = false,
  onResetCode,
}: Props) {
  const [animateRef] = useAutoAnimate()
  const previousGenerating = useRef<boolean>(false)
  const form = useRef<HTMLFormElement>(null)

  const mounted = useMounted()

  useEffect(() => {
    previousGenerating.current = generating
  }, [generating])

  useEffect(() => {
    if (!sending) {
      form.current?.reset()
    }
  }, [sending])

  return (
    <div
      className={clsx("rounded-xl overflow-y-scroll h-full bg-dracula flex flex-col", {
        "animate-pulse": generating,
      })}
      ref={animateRef}
    >
      <div className="flex-1">
        {mounted && (
          <CodeMirror
            data-gramm="false"
            data-gramm_editor="false"
            data-enable-grammarly="false"
            editable={false}
            value={code}
            extensions={[python()]}
            theme={dracula}
          />
        )}
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
            disabled={sending || generating}
            maxLength={40}
          />
          <Button type="submit" disabled={sending || generating} size="icon" className="shrink-0">
            <Send className="w-5 h-5" />
            <span className="sr-only">Send</span>
          </Button>
          <Button
            type="button"
            size="icon"
            variant="destructive"
            className="shrink-0"
            onClick={onResetCode}
          >
            <RotateCcw className="w-5 h-5" />
            <span className="sr-only">Reset</span>
          </Button>
        </form>
      </div>
    </div>
  )
}

import React, { useEffect, useRef } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { python } from "@codemirror/lang-python"
import { dracula } from "@uiw/codemirror-theme-dracula"
import { AiMessageType } from "./PanelSkeleton"
import clsx from "clsx"
import { useAutoAnimate } from "@formkit/auto-animate/react"

type Props = {
  code?: AiMessageType
}

const defaultCode = `
def solution(numbers, target):
    ...
`

export default function CodePanel({ code }: Props) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [animateRef] = useAutoAnimate()
  const generating = code?.parsed?.state === "generating"
  const previousGenerating = useRef<boolean>(false)

  useEffect(() => {
    previousGenerating.current = generating
  }, [generating])

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
    </div>
  )
}

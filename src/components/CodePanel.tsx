import React from "react"
import CodeMirror from "@uiw/react-codemirror"
import { python } from "@codemirror/lang-python"
import { dracula } from "@uiw/codemirror-theme-dracula"

type Props = {
  code?: string
}

export default function CodePanel({ code }: Props) {
  return (
    <div className="bg-card rounded-xl overflow-y-scroll">
      <CodeMirror
        data-gramm="false"
        data-gramm_editor="false"
        data-enable-grammarly="false"
        editable={false}
        value={code}
        extensions={[python()]}
        theme={dracula}
      />
    </div>
  )
}

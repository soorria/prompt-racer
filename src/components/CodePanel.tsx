import React, { useState } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { javascript } from "@codemirror/lang-javascript"
import { dracula } from "@uiw/codemirror-theme-dracula"

type Props = {
  initialCode?: string
}
const code = `import React from "react"
import { Button } from "./ui/button"
import { ModeToggle } from "./ModeToggle"
import { Fugaz_One } from "next/font/google"
import { SignInButton } from "@clerk/nextjs"
import AuthButton from "./AuthButton"

const Fugaz = Fugaz_One({ weight: "400", subsets: ["latin"] })

type Props = {}

export default function NavBar({}: Props) {
  return (
    <div className="flex-row justify-between flex px-5 py-5 bg-card items-center rounded-xl h-20">
      <div className={"font-display"}>
        <div className="text-xl flex flex-row">
          PROMPT<div className="text-primary">RACER</div>
        </div>
      </div>
      <AuthButton />
    </div>
  )
}
`

export default function CodePanel({ initialCode = code }: Props) {
  return (
    <div className="bg-card h-full rounded-xl overflow-y-scroll">
      <CodeMirror
        data-gramm="false"
        data-gramm_editor="false"
        data-enable-grammarly="false"
        editable={false}
        value={initialCode}
        extensions={[javascript({ jsx: true })]}
        theme={dracula}
      />
    </div>
  )
}

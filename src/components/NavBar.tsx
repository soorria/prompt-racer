import React from "react"
import AuthButton from "./AuthButton"

type Props = {}

export default function NavBar({}: Props) {
  return (
    <nav className="flex-row justify-between flex px-5 py-5 bg-card items-center rounded-xl h-20">
      <div className={"font-display"}>
        <div className="text-xl flex flex-row">
          PROMPT<div className="text-primary">RACER</div>
        </div>
      </div>
      <AuthButton />
    </nav>
  )
}

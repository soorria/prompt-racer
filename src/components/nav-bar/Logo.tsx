import React from "react"
import Link from "next/link"

export default function Logo() {
  return (
    <div className="font-display">
      <Link className="flex flex-row text-xl" href="/">
        PROMPT<div className="text-primary">RACER</div>
      </Link>
    </div>
  )
}

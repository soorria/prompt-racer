import React from "react"
import Link from "next/link"

import { cn } from "~/lib/utils"

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("font-display")}>
      <Link className={cn("flex flex-row text-xl", className)} href="/">
        PROMPT<div className="text-primary">RACER</div>
      </Link>
    </div>
  )
}

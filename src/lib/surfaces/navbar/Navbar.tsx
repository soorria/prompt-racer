import React from "react"

import { cn } from "~/lib/utils"

export default function Navbar({
  leftContent,
  rightContent,
}: Readonly<{ leftContent: React.ReactNode; rightContent: React.ReactNode }>) {
  return (
    <nav
      className={cn(
        "flex h-20 flex-shrink-0 flex-row items-center justify-between overflow-hidden rounded-xl bg-card p-3 sm:p-5",
      )}
    >
      {leftContent}
      <div className="flex items-center gap-4 sm:gap-6">{rightContent}</div>
    </nav>
  )
}

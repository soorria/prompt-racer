"use client"

import React from "react"

import { cn } from "~/lib/utils"

export default function Navbar({
  leftContent,
  rightContent,
  className,
}: Readonly<{
  leftContent: React.ReactNode
  rightContent: React.ReactNode
  className?: string
}>) {
  return (
    <nav
      className={cn(
        "flex h-16 flex-shrink-0 items-center overflow-hidden rounded-xl rounded-t-none bg-card p-4",
        className,
      )}
    >
      <div className="flex w-full flex-row items-center justify-between">
        {leftContent}
        <div className="flex items-center gap-4 sm:gap-6">{rightContent}</div>
      </div>
    </nav>
  )
}

"use client"

import React from "react"
import Link from "next/link"
import { useMediaQuery } from "@react-hook/media-query"
import { ChevronDown } from "lucide-react"

import { MOBILE_VIEWPORT } from "~/components/game-screen/GameLayout"
import { Button } from "~/components/ui/button"
import ResponsiveDialog from "~/components/ui/ResponsiveDialog"
import { cn } from "~/lib/utils"

export default function Navbar({
  leftContent,
  rightContent,
}: Readonly<{ leftContent: React.ReactNode; rightContent: React.ReactNode }>) {
  return (
    <nav
      className={cn(
        "h-8 flex-shrink-0 overflow-hidden rounded-xl rounded-t-none bg-card p-0 sm:h-16 sm:p-5",
      )}
    >
      <ResponsiveDialog
        title="Game settings"
        renderTrigger={(props) => (
          <div className="flex h-full w-full items-center px-5 sm:hidden">
            <ChevronDown className="h-4 w-4 opacity-30" />
            <div className="flex flex-1 flex-row justify-center" onClick={props.openDialog}>
              <span className={cn("text-md flex w-fit font-display")}>
                IN<div className="text-yellow-500">PROGRESS</div>
              </span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-30" />
          </div>
        )}
        renderContent={(props) => (
          <>
            <Button asChild className="w-full" variant={"outline"}>
              <Link href="/" onClick={props.closeDialog}>
                Go to home
              </Link>
            </Button>
          </>
        )}
      />
      <div className="hidden w-full flex-row items-center justify-between sm:flex">
        {leftContent}
        <div className="flex items-center gap-4 sm:gap-6">{rightContent}</div>
      </div>
    </nav>
  )
}

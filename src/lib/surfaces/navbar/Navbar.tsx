"use client"

import React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"
import { ChevronDown } from "lucide-react"

import ResponsiveDialog from "~/components/ui/ResponsiveDialog"
import { cn } from "~/lib/utils"

export default function Navbar({
  leftContent,
  rightContent,
  actions,
}: Readonly<{
  leftContent: React.ReactNode
  rightContent: React.ReactNode
  actions: React.ReactNode
}>) {
  return (
    <nav
      className={cn(
        "h-8 flex-shrink-0 overflow-hidden rounded-xl rounded-t-none bg-card p-0 sm:h-16 sm:p-5",
      )}
    >
      {/* Mobile View */}
      <div className="flex h-full w-full items-center px-5 sm:hidden">
        <div className="flex flex-1 flex-row justify-center">{leftContent}</div>
        <ResponsiveDialog
          title="Actions"
          renderTrigger={(props) => (
            <div className="flex h-full w-full items-center px-5">
              <div onClick={props.openDialog}>{rightContent}</div>
            </div>
          )}
          renderContent={(props) => (
            <div onClick={props.closeDialog} className="bg-red-100">
              {actions}
            </div>
          )}
        />
      </div>

      {/* Desktop View */}
      <div className="hidden w-full flex-row items-center justify-between sm:flex">
        {leftContent}
        <div className="flex items-center gap-4 sm:gap-6">
          <Popover>
            <PopoverTrigger className="flex items-center justify-center space-x-3">
              {rightContent}
              <ChevronDown />
            </PopoverTrigger>
            <PopoverContent className="p-0 py-2" align="end">
              {actions}
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </nav>
  )
}

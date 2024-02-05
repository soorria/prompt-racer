"use client"
import React from "react"
import AuthButton from "./AuthButton"
import Link from "next/link"
import { useConvexAuth } from "convex/react"
import { api } from "~convex/api"
import clsx from "clsx"
import { usePathname } from "next/navigation"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { useWrappedQuery } from "~/lib/convex-utils"
import { FEEDBACK_FORM_URL } from "~/lib/feedback"

type Props = {}

export default function NavBar({}: Props) {
  const { isAuthenticated } = useConvexAuth()
  const gameQuery = useWrappedQuery(
    api.games.getLatestActiveGameForAuthedUser,
    !isAuthenticated ? "skip" : undefined
  )
  const game = gameQuery.data

  const pathname = usePathname()
  const onHomePage = pathname === "/"

  return (
    <nav
      className={clsx(
        "flex-row  flex p-3 sm:p-5 justify-between items-center rounded-xl h-20 z-10",
        onHomePage ? "bg-card/50" : "bg-card"
      )}
    >
      <div className="font-display">
        {game?.state === "waiting-for-players" && (
          <div className="text-xl flex flex-row items-center">
            <Link href={`/g/play/asdf`} className="block flex-shrink-0 w-auto">
              FINDING <span className="ml-1 text-orange-400 animate-pulse">PLAYERS</span>
            </Link>
          </div>
        )}
        {game?.state === "in-progress" && (
          <Link href={`/g/play/${game._id}`} className="text-xl flex flex-row">
            GAME <div className="ml-2 text-red-400 animate-pulse">IN-PROGRESS</div>
          </Link>
        )}
        {!game && (
          // Show this if there's no active game but user is authenticated
          <Link className="text-xl flex flex-row" href="/">
            PROMPT<div className="text-primary">RACER</div>
          </Link>
        )}
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <Tooltip>
          <TooltipTrigger asChild>
            <button tabIndex={-1} className="px-2 py-1 text-sm bg-yellow-800 rounded-md">
              Beta
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="max-w-xs">
              Beware bugs! We&apos;re still in beta and all data could be deleted at any time as we
              work on this :).{" "}
              <a href={FEEDBACK_FORM_URL} target="_blank" className="underline">
                Click to provide feedback & suggestions
              </a>
            </p>
          </TooltipContent>
        </Tooltip>

        <AuthButton />
      </div>
    </nav>
  )
}

"use client"
import React from "react"
import AuthButton from "./AuthButton"
import Link from "next/link"
import { useConvexAuth, useMutation, useQuery } from "convex/react"
import { api } from "~convex/api"
import { useConvexUser } from "~/lib/convex"
import clsx from "clsx"
import invariant from "tiny-invariant"
import { useRouter, usePathname } from "next/navigation"

type Props = {}

export default function NavBar({}: Props) {
  const { isAuthenticated } = useConvexAuth()
  const game = useQuery(
    api.games.getLatestActiveGameForAuthedUser,
    !isAuthenticated ? "skip" : undefined
  )
  const currentUser = useConvexUser()
  const router = useRouter()

  const pathname = usePathname()
  const onHomePage = pathname === "/"

  return (
    <nav
      className={clsx(
        "flex-row justify-between flex px-5 py-5 items-center rounded-xl h-20 z-10",
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
      <AuthButton />
    </nav>
  )
}

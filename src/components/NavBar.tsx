"use client"
import React from "react"
import AuthButton from "./AuthButton"
import Link from "next/link"
import { Authenticated, useConvexAuth, useMutation, useQuery } from "convex/react"
import { api } from "~convex/api"
import { useConvexUser } from "~/lib/convex"
import clsx from "clsx"
import { Button } from "./ui/button"
import invariant from "tiny-invariant"
import { useRouter, usePathname } from "next/navigation"

type Props = {}

export default function NavBar({}: Props) {
  const { isAuthenticated } = useConvexAuth()
  const skip = "skip"
  const game = useQuery(
    api.games.getLatestActiveGameForAuthedUser,
    !isAuthenticated ? "skip" : undefined
  )
  const leaveGame = useMutation(api.games.leaveGame)
  const currentUser = useConvexUser()
  const router = useRouter()

  const handleLeaveGame = () => {
    invariant(game, "activeGame should exist")
    invariant(currentUser, "currentUser should exist")
    leaveGame({ gameId: game._id }).then((success) => success && router.push("/g"))
  }

  const pathname = usePathname()
  const onHomePage = pathname === "/"

  console.log({ pathname, onHomePage })

  return (
    <nav
      className={clsx(
        "flex-row justify-between flex px-5 py-5 items-center rounded-xl h-20 z-10",
        onHomePage ? "bg-card/50" : "bg-card"
      )}
    >
      <div className="font-display">
        {isAuthenticated ? (
          <>
            {game ? (
              <>
                {game?.state === "in-progress" ? (
                  <Link href={`/g/play/${game._id}`} className="text-xl flex flex-row">
                    GAME <div className="ml-2 text-red-400 animate-pulse">IN-PROGRESS</div>
                  </Link>
                ) : (
                  <div className="text-xl flex flex-row items-center">
                    FINDING <div className="ml-2 text-orange-400 animate-pulse">PLAYERS</div>
                    <div className="mx-4 w-1 h-12 bg-white/50 rounded-full"></div>
                    <Button
                      className="font-sans border-white/30"
                      variant={"outline"}
                      onClick={handleLeaveGame}
                    >
                      Leave game
                    </Button>
                  </div>
                )}
              </>
            ) : (
              // Show this if there's no active game but user is authenticated
              <Link className="text-xl flex flex-row" href="/">
                PROMPT<div className="text-primary">RACER</div>
              </Link>
            )}
          </>
        ) : (
          // Default navbar content for unauthenticated users
          <Link className="text-xl flex flex-row" href="/">
            PROMPT<div className="text-primary">RACER</div>
          </Link>
        )}
      </div>
      <AuthButton />
    </nav>
  )
}

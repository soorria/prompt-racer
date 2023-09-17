"use client"
import React from "react"
import AuthButton from "./AuthButton"
import Link from "next/link"
import { useMutation, useQuery } from "convex/react"
import { api } from "~convex/api"
import { useConvexUser } from "~/lib/convex"
import clsx from "clsx"
import { Button } from "./ui/button"
import invariant from "tiny-invariant"
import { useRouter } from "next/navigation"

type Props = {}

export default function NavBar({}: Props) {
  const game = useQuery(api.games.getLatestActiveGameForAuthedUser)
  const leaveGame = useMutation(api.games.leaveGame)
  const currentUser = useConvexUser()
  const router = useRouter()

  const handleLeaveGame = () => {
    invariant(game, "activeGame should exist")
    invariant(currentUser, "currentUser should exist")
    leaveGame({ gameId: game._id }).then((success) => success && router.push("/g"))
  }

  return (
    <nav
      className={clsx(
        "flex-row justify-between flex px-5 py-5 items-center rounded-xl h-20 bg-card"
      )}
    >
      <div className="font-display">
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
          <Link className="text-xl flex flex-row" href="/">
            PROMPT<div className="text-primary">RACER</div>
          </Link>
        )}
      </div>
      <AuthButton />
    </nav>
  )
}

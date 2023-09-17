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

type Props = {}

export default function NavBar({}: Props) {
  const game = useQuery(api.games.getLatestActiveGameForAuthedUser)
  const cancelGame = useMutation(api.games.cancelGame)
  const currentUser = useConvexUser()

  const handleCancelGame = () => {
    invariant(game, "activeGame should exist")
    invariant(currentUser, "currentUser should exist")
    cancelGame({ gameId: game._id })
  }

  const handleLeaveGame = () => {
    invariant(game, "activeGame should exist")
    invariant(currentUser, "currentUser should exist")
    // leaveGame({ gameId: currentGame._id })
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
              <div className="text-xl flex flex-row">
                GAME <div className="ml-2 text-red-400 animate-pulse">IN-PROGRESS</div>
              </div>
            ) : (
              <div className="text-xl flex flex-row">
                FINDING <div className="ml-2 text-orange-400 animate-pulse">PLAYERS</div>
              </div>
            )}
          </>
        ) : (
          <Link className="text-xl flex flex-row" href="/">
            PROMPT<div className="text-primary">RACER</div>
          </Link>
        )}
      </div>
      {game?.state === "in-progress" && (
        <>
          {currentUser?.userId === game?.creatorId ? (
            <Button
              variant={"destructive"}
              onClick={handleCancelGame}
              disabled={game.state === "in-progress"}
            >
              Cancel Game
            </Button>
          ) : (
            <Button variant={"destructive"} onClick={handleLeaveGame}>
              Leave game
            </Button>
          )}
        </>
      )}
      <AuthButton />
    </nav>
  )
}

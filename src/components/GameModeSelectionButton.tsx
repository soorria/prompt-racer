"use client"
import React, { useState } from "react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { api } from "~convex/api"
import { Loader2 } from "lucide-react"
import { useWrappedAction, useWrappedQuery } from "~/lib/convex-utils"

export default function GameModeSelectionButton() {
  const game = useWrappedQuery(api.games.getLatestActiveGameForAuthedUser, {})
  const router = useRouter()
  const joinGame = useWrappedAction(api.games.joinGame)

  const handleJoinGame = async () => {
    const { gameId } = await joinGame.mutateAsync(undefined)
    router.push(`/g/play/${gameId}`)
  }

  return (
    <>
      <Button
        variant={"outline"}
        onClick={handleJoinGame}
        disabled={
          joinGame.isLoading ||
          game.data?.state === "in-progress" ||
          game.data?.state === "waiting-for-players"
        }
      >
        {joinGame.isLoading ? (
          <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
        ) : (
          "Join game!"
        )}
      </Button>
    </>
  )
}

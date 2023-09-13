"use client"
import React from "react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { api } from "~convex/api"
import { useAction } from "convex/react"

export default function GameModeSelectionButton() {
  const router = useRouter()
  const joinGame = useAction(api.games.joinGame)

  const handleJoinGame = async () => {
    const { gameId } = await joinGame()
    router.push(`/g/play/${gameId}`)
  }

  return (
    <>
      <Button
        variant={"outline"}
        onClick={() => {
          handleJoinGame()
        }}
      >
        Join game!
      </Button>
    </>
  )
}

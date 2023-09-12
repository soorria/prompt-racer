"use client"
import React from "react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { api } from "~convex/api"
import { useAction, useQuery } from "convex/react"

type Props = {
  route: string
}

export default function GameModeSelectionButton({ route }: Props) {
  const router = useRouter()
  const joinGame = useAction(api.games.joinGame)

  const handleJoinGame = () => {
    joinGame()
  }

  return (
    <>
      <Button
        className="mt-4"
        variant={"outline"}
        onClick={() => {
          router.push(`/${route}`)
          handleJoinGame()
        }}
      >
        Join game!
      </Button>
    </>
  )
}

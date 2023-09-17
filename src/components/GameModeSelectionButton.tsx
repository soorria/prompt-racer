"use client"
import React, { useState } from "react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { api } from "~convex/api"
import { useAction } from "convex/react"
import { Loader2 } from "lucide-react"

export default function GameModeSelectionButton() {
  const router = useRouter()
  const joinGame = useAction(api.games.joinGame)

  const [loading, setLoading] = useState(false)

  const handleJoinGame = async () => {
    setLoading(true)
    try {
      const { gameId } = await joinGame()
      router.push(`/g/play/${gameId}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button variant={"outline"} onClick={handleJoinGame} disabled={loading}>
        {loading ? (
          <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
        ) : (
          "Join game!"
        )}
      </Button>
    </>
  )
}

"use client"

import { useRouter } from "next/navigation"

import { Button } from "~/components/ui/button"
import { joinGameAction } from "~/lib/games/actions"

export function GameJoinButton() {
  const router = useRouter()
  return (
    <Button
      onClick={async () => {
        const result = await joinGameAction()
        if (result?.data?.game_id) {
          router.push(`/tmp/game/${result.data.game_id}`)
        }
      }}
    >
      Join game
    </Button>
  )
}

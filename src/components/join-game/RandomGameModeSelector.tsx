"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Shuffle } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { joinGameAction } from "~/lib/games/actions"
import { cn } from "~/lib/utils"
import { Button } from "../ui/button"

export default function RandomGameModeSelector() {
  const router = useRouter()
  const { execute, isExecuting, hasSucceeded } = useAction(joinGameAction, {
    onSuccess: async ({ data }) => {
      const gameId = data?.game_id
      router.push(`/games/play/${gameId}`)
    },
    onError: () => {
      toast.error("Failed to join game")
    },
  })

  return (
    <div className="mx-auto max-w-sm">
      <div className="isolate mx-auto my-16 grid grid-cols-1 gap-4 gap-y-8 lg:mx-0 lg:grid-cols-1">
        <div
          className={cn(
            "relative flex flex-col justify-between gap-4 rounded-3xl bg-card p-8 ring-1 ring-gray-200/20",
          )}
        >
          <div className="">
            <div className="mb-6 flex justify-center">
              <Shuffle size={120} />
            </div>
            <h3 className={cn("mt-6 font-semibold first-letter:text-lg")}>Random Game Mode</h3>
            <p className="text-sm leading-6 text-zinc-500">
              Start the game, and see what mode you get!
            </p>
            <Button
              isLoading={isExecuting}
              disabled={hasSucceeded}
              onClick={() => execute()}
              className="mt-5 w-full ring-2 ring-zinc-700"
              variant={"outline"}
            >
              Join game!
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

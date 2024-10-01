"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { usePostHog } from "posthog-js/react"

import { api } from "~/lib/trpc/react"
import { cn } from "~/lib/utils"
import { Button } from "../ui/button"
import { AnimatedBorder } from "../ui/custom/animated-border"

export default function RandomGameModeSelector() {
  const router = useRouter()
  const posthog = usePostHog()
  const joinGame = api.games.join.useMutation({
    onMutate() {
      posthog.capture("Joined game")
    },
    onSuccess: async ({ game_id }) => {
      router.push(`/games/play/${game_id}`)
    },
  })

  return (
    <div className="mx-auto max-w-sm">
      <div className="isolate mx-auto my-16 grid grid-cols-1 gap-4 gap-y-8 lg:mx-0 lg:grid-cols-1">
        <AnimatedBorder borderRadius={12}>
          <div
            className={cn(
              "bubbles relative flex flex-col justify-between gap-4 rounded-3xl bg-card p-8 ring-1 ring-gray-200/20",
            )}
          >
            <div className="">
              <h3 className={cn("font-semibold first-letter:text-lg")}>Random Game Mode</h3>
              <p className="text-sm leading-6 text-zinc-500">
                Start the game, and see what mode you get!
              </p>
              <Button
                isLoading={joinGame.isPending}
                disabled={joinGame.isSuccess}
                onClick={() => joinGame.mutate({})}
                className="mt-5 w-full ring-2 ring-zinc-700"
                variant={"outline"}
              >
                Join game!
              </Button>
            </div>
          </div>
        </AnimatedBorder>
      </div>
    </div>
  )
}

"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { type User } from "@supabase/supabase-js"
import { Shuffle } from "lucide-react"
import { usePostHog } from "posthog-js/react"

import type { QuestionDifficultyLevels } from "~/lib/games/constants"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { api } from "~/lib/trpc/react"
import { cn } from "~/lib/utils"
import { Button } from "../ui/button"

export default function RandomGameModeSelector({ user }: { user: User | null }) {
  const [difficulty, setDifficulty] = React.useState<QuestionDifficultyLevels | undefined>(
    undefined,
  )
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
      {user && user.role === "admin" && (
        <Select
          onValueChange={(a: QuestionDifficultyLevels) => setDifficulty(a)}
          defaultValue={"easy"}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      )}
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
              isLoading={joinGame.isPending}
              disabled={joinGame.isSuccess}
              onClick={() => {
                joinGame.mutate({ difficulty })
              }}
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

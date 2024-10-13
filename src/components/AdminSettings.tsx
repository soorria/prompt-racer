import React from "react"
import { useRouter } from "next/navigation"
import { usePostHog } from "posthog-js/react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { type QuestionDifficultyLevels } from "~/lib/games/constants"
import { api } from "~/lib/trpc/react"
import { Button } from "./ui/button"

type Props = { gameId?: string }

type ForceGameStatusChange = "waitingForPlayers" | "inProgress" | "finished"

export default function AdminSettings({ gameId }: Props) {
  const router = useRouter()
  const posthog = usePostHog()
  const trpcUtils = api.useUtils()
  const joinGame = api.games.join.useMutation({
    onMutate() {
      posthog.capture("Joined game")
    },
    onSuccess: async ({ game_id }) => {
      router.push(`/games/play/${game_id}`)
    },
  })
  const forceStateChangeMutation = api.games.forceProgressGameState.useMutation({
    onSuccess: () => {
      void trpcUtils.games.getGameStateWithQuestion.invalidate()
    },
  })
  const [gameState, setGameState] = React.useState<ForceGameStatusChange>("waitingForPlayers")

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Select defaultValue={"easy"}>
          <SelectTrigger className="w-full flex-1">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={(e) => {
            console.log("asdf", e)

            // joinGame.mutate({ difficulty })
          }}
        >
          Join game
        </Button>
      </div>
      {gameId && (
        <div className="flex gap-2">
          Change game state
          <Select defaultValue={"waitingForPlayers"}>
            <SelectTrigger className="w-full flex-1" onPointerDown={(e) => e.stopPropagation()}>
              <SelectValue placeholder="Game state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="waitingForPlayers">Waiting for players</SelectItem>
              <SelectItem value="inProgress">In progress</SelectItem>
              <SelectItem value="finished">Finished</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={(e) => {
              console.log("asdf", e)

              // forceStateChangeMutation.mutate({ game_id: gameId, game_state: gameState })
            }}
          >
            Change state
          </Button>
        </div>
      )}
    </div>
  )
}

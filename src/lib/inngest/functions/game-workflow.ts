import type { InngestEvents } from "~/lib/inngest/client"
import { FINALIZING_SUBMISSION_BUFFER_TIME } from "~/lib/games/constants"
import { advanceGameToStatus, finalizeGame } from "~/lib/games/internal-actions"
import { inngest } from "~/lib/inngest/client"

export const gameWorkflowFunction = inngest.createFunction(
  {
    id: "game-workflow",
    cancelOn: [
      {
        event: "game/cancelled",
        match: "data.game_id",
      },
    ],
  },
  {
    event: "game/started",
  },
  async ({ step, event: _event }) => {
    const event = _event as InngestEvents["game/started"]

    await step.sleep("waiting-for-players", event.data.waiting_for_players_duration_ms)

    await Promise.all([
      step.run("set-game-state-to-in-progress", async () => {
        await advanceGameToStatus(event.data.game_id, "inProgress")
      }),
      step.sleep("in-progress", event.data.in_progress_duration_ms),
    ])

    await step.run("set-game-state-to-finalising", async () => {
      await advanceGameToStatus(event.data.game_id, "finalising")
    })

    await step.sleep("buffer-for-pending-submissions", FINALIZING_SUBMISSION_BUFFER_TIME)

    await step.run("finalize-game", async () => {
      await finalizeGame(event.data.game_id)
    })
  },
)

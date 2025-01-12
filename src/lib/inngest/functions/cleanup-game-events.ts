import { db } from "~/lib/db"
import { deleteOldGameEvents } from "~/lib/games/events/server"
import { inngest } from "~/lib/inngest/client"

export const cleanupGameEventsFunction = inngest.createFunction(
  {
    id: "cleanup-game-events",
  },

  {
    cron: "0 0 * * 0",
  },

  async ({ step }) => {
    await step.run("delete-game-events", async () => {
      await deleteOldGameEvents(db)
    })
  },
)

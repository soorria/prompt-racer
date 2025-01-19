import { serve } from "inngest/next"

import { inngest } from "~/lib/inngest/client"
import { cleanupGameEventsFunction } from "~/lib/inngest/functions/cleanup-game-events"
import { gameWorkflowFunction } from "~/lib/inngest/functions/game-workflow"

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [gameWorkflowFunction, cleanupGameEventsFunction],
})

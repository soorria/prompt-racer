import { PostHog } from "posthog-node"

import { env } from "~/env"
import { logger } from "../server/logger"

console.log({
  k: env.NEXT_PUBLIC_POSTHOG_KEY,
})

const posthogServer = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
  // disabled: process.env.NODE_ENV === "development",
  disabled: false,

  /**
   * Needed for serverless environments
   */
  flushAt: 1,
  flushInterval: 0,
})

// if (process.env.NODE_ENV === "development") {
posthogServer.debug(true)
//

posthogServer.on("error", (e: unknown) => {
  logger.error(e, "posthog error")
})

export function captureUserEvent(
  userId: string,
  event: string,
  properties: Record<string, unknown> = {},
) {
  try {
    if (process.env.NODE_ENV === "development") {
      logger.debug(`capturing user event`, {
        event,
        userId,
        properties,
      })
    }

    posthogServer.capture({
      distinctId: userId,
      event,
      properties,
    })
  } catch (e) {
    logger.error(e, "failed to capture user event")
  }
}

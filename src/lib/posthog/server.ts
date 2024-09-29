import { PostHog } from "posthog-node"

import { env, IS_DEV } from "~/env"
import { logger } from "../server/logger"

const posthogServer = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
  disabled: IS_DEV,

  /**
   * Needed for serverless environments
   */
  flushAt: 1,
  flushInterval: 0,
})

if (IS_DEV) {
  posthogServer.debug(true)
}

posthogServer.on("error", (e: unknown) => {
  logger.error(e, "posthog error")
})

export function captureUserEvent(
  userId: string,
  event: string,
  properties: Record<string, unknown> = {},
) {
  try {
    if (IS_DEV) {
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

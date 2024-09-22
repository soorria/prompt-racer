import { PostHog } from "posthog-node"

import { env, IS_PROD } from "~/env"
import { logger } from "../server/logger"

const posthogServer = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
  disabled: !IS_PROD,

  /**
   * Needed for serverless environments
   */
  flushAt: 1,
  flushInterval: 0,
})

export function captureUserEvent(
  userId: string,
  event: string,
  properties: Record<string, unknown> = {},
) {
  try {
    posthogServer.capture({
      distinctId: userId,
      event,
      properties,
    })
  } catch (e) {
    logger.error(e, "failed to capture user event")
  }
}

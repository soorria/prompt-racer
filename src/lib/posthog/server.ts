import { PostHog } from "posthog-node"

import { env } from "~/env"
import { logger } from "../server/logger"

const isLocal = process.env.NODE_ENV === "development"

const posthogServer = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
  disabled: isLocal,

  /**
   * Needed for serverless environments
   */
  flushAt: 1,
  flushInterval: 0,

  fetch: (url: string, options: RequestInit) => {
    console.log("fetching", url, options)

    return fetch(url, {
      ...options,
    })
  },
})

console.log({
  k: env.NEXT_PUBLIC_POSTHOG_KEY,
  isLocal,
  phd: posthogServer.disabled,
})

if (process.env.NODE_ENV === "development") {
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
    console.log("capturing user event", { event, userId, properties })

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

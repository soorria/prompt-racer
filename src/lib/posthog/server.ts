import { PostHog } from "posthog-node"

import { env, IS_PROD } from "~/env"

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
  posthogServer.capture({
    distinctId: userId,
    event,
    properties,
  })
}

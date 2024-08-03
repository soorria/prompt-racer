import { createSafeActionClient } from "next-safe-action"
import { requireAuthUser } from "../auth/user"
import { logger } from "../server/logger"

export const action = createSafeActionClient({
  handleServerErrorLog(originalError) {
    logger.error(originalError, "uncaught error in server action")
  },
})

export const authedAction = action.use(async ({ next }) => {
  const user = await requireAuthUser()
  return next({ ctx: { user } })
})

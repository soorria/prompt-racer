import { createSafeActionClient } from "next-safe-action"
import { requireAuthUser } from "../auth/user"

export const action = createSafeActionClient({})

export const authedAction = action.use(async ({ next }) => {
  const user = await requireAuthUser()
  return next({ ctx: { user } })
})

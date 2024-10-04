import { cache } from "react"

import { logger } from "../server/logger"
import { createServerClient } from "../supabase/server"

async function getAuthUserImpl() {
  const sb = createServerClient()
  const { data, error } = await sb.auth.getUser()

  if (error) {
    logger.error(error, "failed to get user")
    return null
  }

  return data.user
}

export const getAuthUser = cache(getAuthUserImpl)

export async function requireAuthUser() {
  const user = await getAuthUser()
  if (!user) {
    throw new Error("User is not authenticated")
  }
  return user
}

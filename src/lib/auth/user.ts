import { logger } from "../server/logger"
import { createServerClient } from "../supabase/server"

export async function getAuthUser() {
  const sb = createServerClient()
  const { data, error } = await sb.auth.getUser()

  if (error) {
    logger.debug(error, "failed to get auth user")
    return null
  }

  return data.user
}

export async function requireAuthUser() {
  const user = await getAuthUser()
  if (!user) {
    throw new Error("User is not authenticated")
  }
  return user
}

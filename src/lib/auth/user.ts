import { cache } from "react"

import { cmp, db, schema } from "../db"
import { logger } from "../server/logger"
import { createServerClient } from "../supabase/server"
import { type User } from "@supabase/supabase-js"

export const ADMIN_EMAILS = ["soorria.ss@gmail.com", "ericcpaul00@gmail.com"]

async function getAuthUserImpl(): Promise<User | null> {
  const sb = createServerClient()
  const { data, error } = await sb.auth.getUser()

  if (data.user === null || error) {
    logger.error(error, "failed to get user")
    return null
  }

  const dbUser = await getDBUser(data.user.id);
  if (!dbUser) {
    logger.error(error, "failed to get user")
    return null
  }

  return { ...data.user, userRole: dbUser.role }
}

export const getAuthUser = cache(getAuthUserImpl)

export async function getDBUser(userId: string) {
  const user = await db.query.users.findFirst({
    where: cmp.eq(schema.users.id, userId),
  })
  return user
}

export async function requireAuthUser() {
  const user = await getAuthUser()
  if (!user) {
    throw new Error("User is not authenticated")
  }
  return user
}

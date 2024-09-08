import { type User } from "@supabase/supabase-js"

import { cmp, db, schema } from "../db"

function getNameFromAuthUser(authUser: User) {
  const { user_name } = authUser.user_metadata

  if (typeof user_name === "string") {
    return user_name
  }

  // TODO: google docs thing where it gives you a random name
  return "Anonymous"
}

export async function upsertProfile(authUser: User) {
  await db
    .insert(schema.users)
    .values({
      id: authUser.id,
      name: getNameFromAuthUser(authUser),
    })
    .onConflictDoNothing()
}

export async function getUserProfile(userId: string) {
  const profile = await db.query.users.findFirst({
    where: cmp.eq(schema.users.id, userId),
  })

  return profile
}

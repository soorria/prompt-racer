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

function getProfileImageFromAuthUser(authUser: User) {
  const { user_metadata } = authUser

  return user_metadata?.avatar_url as string | undefined
}

function getGithubUsernameFromAuthUser(authUser: User) {
  const { identities } = authUser
  return identities?.find((identity) => identity.provider === "github")?.identity_data
    ?.user_name as string | undefined
}

export async function upsertProfile(authUser: User) {
  const githubUsername = getGithubUsernameFromAuthUser(authUser)

  await db
    .insert(schema.users)
    .values({
      id: authUser.id,
      name: getNameFromAuthUser(authUser),
      profile_image_url: getProfileImageFromAuthUser(authUser),
      github_username: githubUsername,
    })
    .onConflictDoNothing()
}

export async function getUserProfile(userId: string) {
  const profile = await db.query.users.findFirst({
    where: cmp.eq(schema.users.id, userId),
  })

  return profile
}

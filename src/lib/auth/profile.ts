import { cache } from "react"
import { type User } from "@supabase/supabase-js"
import { TRPCError } from "@trpc/server"
import { isAfter, subSeconds } from "date-fns"

import { cmp, db, schema } from "../db"
import { captureUserEvent } from "../posthog/server"

function getNameFromAuthUser(authUser: User): string {
  const { user_name, name } = authUser.user_metadata as Record<string, unknown>

  if (typeof user_name === "string") {
    return user_name
  }

  if (typeof name === "string") {
    return name
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

  const [result] = await db
    .insert(schema.userProfiles)
    .values({
      id: authUser.id,
      name: getNameFromAuthUser(authUser),
      profile_image_url: getProfileImageFromAuthUser(authUser),
      github_username: githubUsername,
    })
    .onConflictDoNothing()
    .returning({
      inserted_at: schema.userProfiles.inserted_at,
    })
    .execute()

  // simplest way to guesstimate that this is a new user
  if (result && isAfter(result.inserted_at, subSeconds(new Date(), 10))) {
    captureUserEvent(authUser.id, "User signed up", {
      provider: "github",
    })
  }
}

export async function requireUserProfile(userId: string) {
  const profile = await getUserProfile(userId)

  if (!profile) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    })
  }

  return profile
}

async function getUserProfileImpl(userId: string) {
  const profile = await db.query.userProfiles.findFirst({
    where: cmp.eq(schema.userProfiles.id, userId),
  })

  return profile
}

export const getUserProfile = cache(getUserProfileImpl)

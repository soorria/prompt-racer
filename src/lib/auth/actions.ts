"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { env } from "~/env"
import { action } from "../actions/utils"
import { logger } from "../server/logger"
import { createServerClient } from "../supabase/server"

const AUTH_REDIRECT_ORIGIN =
  env.NODE_ENV === "production" ? "https://promptracer.dev" : "http://localhost:3000"
const AUTH_REDIRECT_URL = `${AUTH_REDIRECT_ORIGIN}/auth/callback`

export const loginWithGitHubAction = action.action(async ({ }) => {
  const sb = createServerClient()

  const referrer = headers().get("referer")
  const referrerUrl = referrer ? new URL(referrer) : null

  const { data, error } = await sb.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: AUTH_REDIRECT_URL,
      queryParams: {
        next: referrerUrl?.pathname ?? "/",
      },
    },
  })

  if (error) {
    logger.error(error, "failed to login with github")
    throw error
  }

  redirect(data.url)
})

export const logoutAction = action.action(async () => {
  const sb = createServerClient()
  await sb.auth.signOut()
})

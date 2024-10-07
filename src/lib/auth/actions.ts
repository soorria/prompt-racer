"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import type { LoginOAuthProvider } from "./oauth-providers"
import { env } from "~/env"
import { action } from "../actions/utils"
import { logger } from "../server/logger"
import { createServerClient } from "../supabase/server"
import { LOGIN_OAUTH_PROVIDERS } from "./oauth-providers"

const AUTH_REDIRECT_ORIGIN =
  env.NODE_ENV === "production" ? "https://promptracer.dev" : "http://localhost:3000"
const AUTH_REDIRECT_URL = `${AUTH_REDIRECT_ORIGIN}/auth/callback`

export const loginWithOAuthAction = async (provider: LoginOAuthProvider) => {
  const sb = createServerClient()

  const referrer = headers().get("referer")
  const referrerUrl = referrer ? new URL(referrer) : null

  const { data, error } = await sb.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: AUTH_REDIRECT_URL,
      queryParams: {
        next: referrerUrl?.pathname ?? "/",
      },
    },
  })

  if (error) {
    logger.error(error, `failed to login with ${LOGIN_OAUTH_PROVIDERS[provider].label}`)
    throw error
  }

  redirect(data.url)
}

export const logoutAction = action.action(async () => {
  const sb = createServerClient()
  await sb.auth.signOut()
})

"use server"

import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { action } from "../actions/utils"
import { createServerClient } from "../supabase/server"

export const loginWithGitHubAction = action.action(async ({}) => {
  const sb = createServerClient()

  const referrer = headers().get("referer")
  const referrerUrl = referrer ? new URL(referrer) : null

  const { data, error } = await sb.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: "http://localhost:3000/api/auth/callback",
      queryParams: {
        next: referrerUrl?.pathname ?? "/",
      },
    },
  })

  if (error) {
    throw error
  }

  redirect(data.url)
})

export const logoutAction = action.action(async () => {
  const sb = createServerClient()
  await sb.auth.signOut()
})

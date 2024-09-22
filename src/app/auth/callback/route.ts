import { NextResponse } from "next/server"

import { upsertProfile as upsertUserProfile } from "~/lib/auth/profile"
import { captureUserEvent } from "~/lib/posthog/server"
import { createServerClient } from "~/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)

  const code = searchParams.get("code")
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/"

  if (code) {
    const supabase = createServerClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      if (data.user) {
        await upsertUserProfile(data.user)

        captureUserEvent(data.user.id, "User logged in", {
          provider: data.user.app_metadata.provider,
        })
      }

      const forwardedHost = request.headers.get("x-forwarded-host") // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development"

      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}

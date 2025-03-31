import "server-only"

import { cookies } from "next/headers"
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { createServerClient as _createServerClient } from "@supabase/ssr"
import { createClient } from "@supabase/supabase-js"

import { env } from "~/env"

export function createServerClient() {
  const cookieStore = cookies()

  return _createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

export function createAdminSupabaseClient() {
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
}

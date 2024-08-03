// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { createBrowserClient as _createBrowserClient } from "@supabase/ssr"

import { env } from "~/env"

export function createBrowserClient() {
  return _createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

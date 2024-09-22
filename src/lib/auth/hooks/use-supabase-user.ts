import { queryOptions, useQuery } from "@tanstack/react-query"

import { createBrowserClient } from "~/lib/supabase/browser"
import { getQueryClient } from "~/lib/trpc/react"

const userQueryOptions = queryOptions({
  queryKey: ["user"],
  queryFn: async () => {
    const supabase = createBrowserClient()
    const { data } = await supabase.auth.getUser()
    return data.user
  },
})

if (typeof window !== "undefined") {
  const supabase = createBrowserClient()
  supabase.auth.onAuthStateChange(() => {
    const qc = getQueryClient()
    void qc.invalidateQueries({
      queryKey: userQueryOptions.queryKey,
    })
  })
}

export function useSupabaseUser() {
  return useQuery(userQueryOptions)
}

"use client"

import type { ReactNode } from "react"
import { Suspense, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { type User } from "@supabase/supabase-js"
import { posthog } from "posthog-js"
import { PostHogProvider, usePostHog } from "posthog-js/react"

import { env, IS_PROD } from "~/env"
import { useSupabaseUser } from "../auth/hooks/use-supabase-user"

type PosthogClientProviderProps = {
  children: ReactNode
}

if (typeof window !== "undefined" && IS_PROD) {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: "identified_only",
    loaded(posthog) {
      if (!IS_PROD) {
        posthog.debug()
      }
    },
    /**
     * We're a SPA so need to do this manually
     */
    capture_pageview: false,
  })
}

export function PosthogClientProvider(props: PosthogClientProviderProps) {
  return (
    <PostHogProvider client={posthog}>
      {props.children}
      <Suspense>
        <PosthogTracking />
      </Suspense>
    </PostHogProvider>
  )
}

function PosthogTracking() {
  usePosthogPageView()
  usePosthogIdentify()
  return null
}

function usePosthogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthog = usePostHog()

  useEffect(() => {
    // Track pageviews
    if (pathname && posthog) {
      let url = window.origin + pathname
      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`
      }
      posthog.capture("$pageview", {
        $current_url: url,
      })
    }
  }, [pathname, searchParams, posthog])
}

const IGNORE_EVENTS_USERS_EMAILS = ["soorria.ss@gmail.com", "ericcpaul00@gmail.com"]

function usePosthogIdentify() {
  const posthog = usePostHog()
  const sbUser = useSupabaseUser()

  useEffect(() => {
    const user = sbUser.data
    if (user) {
      const isIgnored = user.email && IGNORE_EVENTS_USERS_EMAILS.includes(user.email)

      if (isIgnored) {
        posthog.opt_out_capturing()
      }

      posthog.identify(user.id, getPosthogProperties(user))
    }
  }, [sbUser.data, posthog])
}

function getPosthogProperties(user: User): Record<string, unknown> {
  return {
    email: user.email,
    name: user.user_metadata.name,
  }
}

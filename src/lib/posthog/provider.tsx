"use client"

import type { ReactNode } from "react"
import { Suspense, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { type User } from "@supabase/supabase-js"
import { posthog } from "posthog-js"
import { PostHogProvider, usePostHog } from "posthog-js/react"

import { env, IS_PROD } from "~/env"
import { useSupabaseUser } from "../auth/hooks/use-supabase-user"
import { IGNORE_EVENTS_USERS_EMAILS } from "../utils/user"

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

      const isLocal = window.location.hostname === "localhost"

      if (isLocal) {
        posthog.opt_out_capturing()
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

function usePosthogIdentify() {
  const posthog = usePostHog()
  const sbUser = useSupabaseUser()

  useEffect(() => {
    const user = sbUser.data

    if (user) {
      posthog.identify(user.id, getPosthogProperties(user))
    }

    const isLocal = window.location.hostname === "localhost"

    const isIgnored =
      isLocal ||
      (user?.email &&
        IGNORE_EVENTS_USERS_EMAILS.includes(user.email) &&
        !sessionStorage.getItem("ignore_creator"))

    if (isIgnored) {
      posthog.opt_out_capturing()
    } else {
      posthog.opt_in_capturing()
    }
  }, [sbUser.data, posthog])
}

function getPosthogProperties(user: User): Record<string, unknown> {
  return {
    email: user.email,
    name: user.user_metadata.name,
  }
}

import { type Provider } from "@supabase/supabase-js"

import { GitHubIcon } from "~/components/ui/icons/GitHub"
import { GoogleIcon } from "~/components/ui/icons/Google"
import { type IconComponent } from "~/components/ui/icons/types"

export const LOGIN_OAUTH_PROVIDERS = {
  github: {
    label: "GitHub",
    icon: GitHubIcon,
  },
  google: {
    label: "Google",
    icon: GoogleIcon,
  },
} satisfies Partial<
  Record<
    Provider,
    {
      label: string
      icon: IconComponent
    }
  >
>

export type LoginOAuthProvider = keyof typeof LOGIN_OAUTH_PROVIDERS

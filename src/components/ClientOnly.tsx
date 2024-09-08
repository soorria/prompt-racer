import { type ReactNode } from "react"

import { useHydrated } from "../lib/utils/use-hydrated"

type ClientOnlyProps = {
  children: ReactNode
  fallback?: ReactNode
}

export function ClientOnly(props: ClientOnlyProps) {
  const hydrated = useHydrated()

  return hydrated ? props.children : props.fallback
}

"use client"

import { useHydrated } from "~/lib/utils/use-hydrated"

export default function LocalDate({ date }: { date: Date | string }) {
  const hydrated = useHydrated()
  date = new Date(date)
  return (
    <span suppressHydrationWarning>{hydrated ? date.toLocaleString() : date.toISOString()}</span>
  )
}

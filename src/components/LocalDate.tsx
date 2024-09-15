"use client"

import { useHydrated } from "~/lib/utils/use-hydrated"

export default function LocalDate({ date }: { date: Date }) {
  const hydrated = useHydrated()
  if (!hydrated) {
    return date.toString()
  }
  return date.toLocaleString()
}

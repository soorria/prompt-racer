"use client"

import React from "react"
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query"

const queryClient = new QueryClient()

export default function GamePageLayout({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

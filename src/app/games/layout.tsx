"use client"

import React from "react"

import { TRPCReactProvider } from "~/lib/trpc/react"

export default function GamePageLayout({ children }: { children: React.ReactNode }) {
  return <TRPCReactProvider>{children}</TRPCReactProvider>
}

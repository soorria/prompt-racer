"use client"
import { ReactNode } from "react"
import { ConvexReactClient, useQuery } from "convex/react"
import { ConvexProviderWithClerk } from "convex/react-clerk"
import { useAuth } from "@clerk/nextjs"
import { api } from "~convex/api"
import { FunctionReference, RegisteredQuery } from "convex/server"

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  )
}

export const useConvexUser = () => useQuery(api.users.getCurrentUser)

export type InferQueryOutput<Query extends FunctionReference<any>> =
  Query extends FunctionReference<any, any, any, infer Output> ? Output : never

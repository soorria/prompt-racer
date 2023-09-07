"use client"
import { SignInButton, UserButton } from "@clerk/nextjs"
import { useConvexAuth } from "convex/react"

export default function Home() {
  const { isAuthenticated } = useConvexAuth()
  return (
    <main className="flex min-h-screen items-center justify-between p-24">
      {isAuthenticated ? <UserButton afterSignOutUrl="/" /> : <SignInButton mode="modal" />}
    </main>
  )
}

"use client"
import { SignInButton, UserButton } from "@clerk/nextjs"
import { useConvexAuth } from "convex/react"
import { ModeToggle } from "~/components/ModeToggle"
import NavBar from "~/components/NavBar"
import { Button } from "~/components/ui/button"
import { useUser } from "@clerk/nextjs"

export default function Home() {
  const { isAuthenticated } = useConvexAuth()
  const user = useUser()
  console.log(user)

  return (
    <>
      <NavBar />
      <main className="flex min-h-screen items-center justify-between p-24">
        {isAuthenticated ? <UserButton afterSignOutUrl="/" /> : <SignInButton mode="modal" />}
      </main>
    </>
  )
}

"use client"

import { SignInButton } from "@clerk/nextjs"
import { useConvexAuth } from "convex/react"
import Link from "next/link"
import AuthButton from "~/components/AuthButton"
import { Button } from "~/components/ui/button"

export default function Home() {
  const { isAuthenticated } = useConvexAuth()

  const playNowButton = (
    <Button asChild>
      <Link href="/g">Play now</Link>
    </Button>
  )

  return (
    <div className="grid place-items-center h-full">
      <div className="text-center flex flex-col gap-8">
        <p>Sick landing page :)</p>

        {isAuthenticated ? (
          <Button asChild>
            <Link href="/g">Play now</Link>
          </Button>
        ) : (
          <SignInButton mode="modal">
            <Button>Play now</Button>
          </SignInButton>
        )}
      </div>
    </div>
  )
}

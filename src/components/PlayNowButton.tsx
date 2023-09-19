"use client"

import { useConvexAuth } from "convex/react"
import { Button } from "./ui/button"
import Link from "next/link"
import { SignInButton } from "@clerk/nextjs"

type PlayNowButtonProps = {}

const PlayNowButton = (props: PlayNowButtonProps) => {
  const { isAuthenticated } = useConvexAuth()
  return isAuthenticated ? (
    <Button asChild>
      <Link href="/g">Play now</Link>
    </Button>
  ) : (
    <SignInButton mode="modal">
      <Button>Play now</Button>
    </SignInButton>
  )
}

export default PlayNowButton

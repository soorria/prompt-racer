"use client"
import React from "react"
import { SignInButton, SignOutButton, UserButton, useUser } from "@clerk/nextjs"
import { useConvexAuth } from "convex/react"
import { Button } from "./ui/button"

type Props = {}

export default function AuthButton({}: Props) {
  const { isAuthenticated } = useConvexAuth()
  const user = useUser()

  return (
    <div className="">
      {isAuthenticated ? (
        <UserButton afterSignOutUrl="/" />
      ) : (
        <SignInButton mode="modal">
          <Button size={"sm"}>Sign In</Button>
        </SignInButton>
      )}
    </div>
  )
}

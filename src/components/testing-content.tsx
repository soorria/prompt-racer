"use client"
import { SignInButton, SignOutButton, UserButton, useUser } from "@clerk/nextjs"
import { useConvexAuth } from "convex/react"

type TestingContentProps = {}

const TestingContent = (props: TestingContentProps) => {
  const { isAuthenticated } = useConvexAuth()
  const user = useUser()
  return (
    <>
      <main className="flex items-center justify-between p-24">
        {isAuthenticated ? <UserButton afterSignOutUrl="/" /> : <SignInButton mode="modal" />}
        <SignOutButton />
      </main>

      <pre>{JSON.stringify(user, null, 2)}</pre>
    </>
  )
}

export default TestingContent

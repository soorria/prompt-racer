/**
 * Intentionally not "use client"-ed. This cannot be a client entrypoint because
 * it requires a non-action function as a prop.
 */

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogIn, LogOut } from "lucide-react"

import { logoutAction } from "~/lib/auth/actions"
import { createBrowserClient } from "~/lib/supabase/browser"
import { Button } from "../ui/button"

export default function LoginLogoutButton({
  isAuthenticated,
  setOpen,
}: {
  isAuthenticated: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    await logoutAction().then(() => {
      void createBrowserClient().auth.signOut()
      router.push("/")
      setOpen(false)
      setIsLoading(false)
    })
  }

  return (
    <>
      {isAuthenticated ? (
        <Button
          variant={"ghost"}
          disabled={isLoading}
          Icon={LogOut}
          className="w-full justify-start rounded-none"
          onClick={handleLogout}
          isLoading={isLoading}
        >
          Logout
        </Button>
      ) : (
        <Button
          variant={"ghost"}
          disabled={isLoading}
          Icon={LogIn}
          className="w-full justify-start rounded-none"
          isLoading={isLoading}
          asChild
        >
          <Link href="/auth/login">Login</Link>
        </Button>
      )}
    </>
  )
}

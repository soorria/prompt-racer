"use client"

import type { User } from "@supabase/supabase-js"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { LogIn, LogOut } from "lucide-react"

import { loginWithGitHubAction, logoutAction } from "~/lib/auth/actions"
import { Button } from "../ui/button"

export default function LoginLogoutButton({
  user,
  setOpen,
}: {
  user: User | null
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    await logoutAction().then(() => {
      router.push("/")
      setOpen(false)
      setIsLoading(false)
    })
  }

  const handleLogin = async () => {
    setIsLoading(true)
    await loginWithGitHubAction().then(() => {
      setOpen(false)
      setIsLoading(false)
    })
  }

  return (
    <>
      {user ? (
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
          onClick={handleLogin}
          isLoading={isLoading}
        >
          Login
        </Button>
      )}
    </>
  )
}

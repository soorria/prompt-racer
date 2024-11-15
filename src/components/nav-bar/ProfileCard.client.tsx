"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { History, Loader2, LogIn, LogOut } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { logoutAction } from "~/lib/auth/actions"
import { type Doc } from "~/lib/db/types"
import { createBrowserClient } from "~/lib/supabase/browser"
import { cn } from "~/lib/utils"
import AdminSettings from "../AdminSettings"
import { Button } from "../ui/button"
import { AnimatedBorder } from "../ui/custom/animated-border"
import ResponsiveDialog from "../ui/ResponsiveDialog"
import UserAvatar from "./UserAvatar"

export default function ClientProfileCard({
  user,
}: {
  user: Doc<"userProfiles"> | null | undefined
}) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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
      {!user ? (
        <AnimatedBorder>
          <Button
            variant="secondary"
            className="w-full justify-start rounded-lg p-2 px-3"
            asChild
            disabled={isLoading}
            isLoading={isLoading}
          >
            <Link href="/auth/login">
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          </Button>
        </AnimatedBorder>
      ) : (
        <>
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger className={cn("flex items-center justify-center")}>
              <UserAvatar name={user?.name} imageUrl={user?.profile_image_url} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/games/history" className="flex items-center">
                    <History className="h-4 w-4" />
                    <span>Previous games</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="flex items-center"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              {user?.role === "admin" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setIsDialogOpen(true)
                      setOpen(false)
                    }}
                  >
                    Admin settings
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {user?.role === "admin" && (
            <ResponsiveDialog
              title="Settings"
              isOpen={isDialogOpen}
              onClose={() => setIsDialogOpen(false)}
              renderContent={() => <AdminSettings />}
            />
          )}
        </>
      )}
    </>
  )
}

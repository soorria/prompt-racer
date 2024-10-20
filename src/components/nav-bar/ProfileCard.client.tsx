"use client"

import React from "react"
import Link from "next/link"
import { History } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { type Doc } from "~/lib/db/types"
import { cn } from "~/lib/utils"
import AdminSettings from "../AdminSettings"
import { Button } from "../ui/button"
import { AnimatedBorder } from "../ui/custom/animated-border"
import ResponsiveDialog from "../ui/ResponsiveDialog"
import LoginLogoutButton from "./LoginLogoutButton"
import UserAvatar from "./UserAvatar"

export default function ClientProfileCard({
  user,
}: {
  user: Doc<"userProfiles"> | null | undefined
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      {!user ? (
        <AnimatedBorder>
          <Button variant={"secondary"} className="w-full justify-start rounded-lg" asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
        </AnimatedBorder>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger className={cn("flex items-center justify-center")}>
            <UserAvatar name={user?.name} imageUrl={user?.profile_image_url} />
          </PopoverTrigger>
          <PopoverContent className="p-0 py-2" align="end">
            {user && (
              <Button
                variant={"ghost"}
                Icon={History}
                onClick={() => setOpen(false)}
                className="w-full justify-start rounded-none"
                asChild
              >
                <Link href="/games/history">Previous games</Link>
              </Button>
            )}
            <LoginLogoutButton key={user?.id ?? ""} isAuthenticated={!!user} setOpen={setOpen} />
            {user?.role === "admin" && (
              <>
                <div className="spacer my-2 h-0.5 w-full bg-gray-200/20" />
                <ResponsiveDialog
                  title="Settings"
                  renderTrigger={(props) => (
                    <Button
                      className="w-full"
                      onClick={() => {
                        props.openDialog()
                      }}
                    >
                      Admin settings
                    </Button>
                  )}
                  renderContent={() => <AdminSettings />}
                />
              </>
            )}
          </PopoverContent>
        </Popover>
      )}
    </>
  )
}

"use client"

import React from "react"
import Link from "next/link"
import { BookOpen } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { type Doc } from "~/lib/db/types"
import { cn } from "~/lib/utils"
import { Button } from "../ui/button"
import LoginLogoutButton from "./LoginLogoutButton"
import UserAvatar from "./UserAvatar"

export default function ProfileCard({ user }: { user: Doc<"users"> | null | undefined }) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={cn("flex items-center justify-center space-x-3 rounded-full")}>
        <UserAvatar name={user?.name} imageUrl={user?.profile_image_url} />
      </PopoverTrigger>
      <PopoverContent className="p-0 py-2" align="end">
        <LoginLogoutButton key={user?.id ?? ""} isAuthenticated={!!user} setOpen={setOpen} />
        <div className="spacer my-2 h-0.5 w-full bg-gray-200/20" />
        <Button
          asChild
          variant={"ghost"}
          Icon={BookOpen}
          className="w-full justify-start rounded-none"
        >
          <Link href="/auth/login">Privacy Policy</Link>
        </Button>
      </PopoverContent>
    </Popover>
  )
}

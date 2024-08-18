"use client"

import type { User } from "@supabase/supabase-js"
import React from "react"
import Link from "next/link"
import { BookOpen } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { cn } from "~/lib/utils"
import { Button } from "../ui/button"
import LoginLogoutButton from "./LoginLogoutButton"
import UserAvatar from "./UserAvatar"

export default function ProfileCard({ user }: { user: User | null }) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn("flex items-center justify-center space-x-3 rounded-full p-2", {
          "ring-2 ring-zinc-400/20": !user,
        })}
      >
        <UserAvatar user={user} />
      </PopoverTrigger>
      <PopoverContent className="p-0 py-2" align="end">
        <LoginLogoutButton key={user?.id ?? ""} user={user} setOpen={setOpen} />
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

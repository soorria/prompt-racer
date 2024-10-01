"use client"

import { type ReactNode } from "react"
import { Slot } from "@radix-ui/react-slot"

import { useSupabaseUser } from "../auth/hooks/use-supabase-user"
import { isSoorria } from "../utils/user"

export function Themed(props: { children: ReactNode }) {
  const user = useSupabaseUser()
  return <Slot data-theme={isSoorria(user.data) ? "just-better" : ""}>{props.children}</Slot>
}

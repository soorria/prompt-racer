import React from "react"

import Logo from "~/components/nav-bar/Logo"
import ProfileCard from "~/components/nav-bar/ProfileCard"
import { getAuthUser } from "~/lib/auth/user"
import Navbar from "~/lib/surfaces/navbar/Navbar"

export default async function BaseLayoutWithNavbar({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser()

  return (
    <div>
      <Navbar leftContent={<Logo />} rightContent={<ProfileCard user={user} />} />
      {children}
    </div>
  )
}

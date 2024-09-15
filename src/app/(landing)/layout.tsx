import React from "react"

import Logo from "~/components/nav-bar/Logo"
import ProfileCard from "~/components/nav-bar/ProfileCard"
import { getAuthUser, getDBUser } from "~/lib/auth/user"
import Navbar from "~/lib/surfaces/navbar/Navbar"

export default async function BaseLayoutWithNavbar({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser()
  const dbUser = user ? await getDBUser(user.id) : null

  return (
    <div>
      <Navbar leftContent={<Logo />} rightContent={<ProfileCard user={dbUser} />} />
      {children}
    </div>
  )
}

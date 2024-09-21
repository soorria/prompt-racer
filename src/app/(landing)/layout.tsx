import React from "react"

import Logo from "~/components/nav-bar/Logo"
import ProfileCard from "~/components/nav-bar/ProfileCard"
import { getAuthUser, getDBUser } from "~/lib/auth/user"
import Navbar from "~/lib/surfaces/navbar/Navbar"
import { TRPCReactProvider } from "~/lib/trpc/react"

export default async function BaseLayoutWithNavbar({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser()
  const dbUser = user ? await getDBUser(user.id) : null

  return (
    <TRPCReactProvider>
      <div>
        <Navbar leftContent={<Logo />} rightContent={<ProfileCard user={dbUser} />} />
        {children}
      </div>
    </TRPCReactProvider>
  )
}

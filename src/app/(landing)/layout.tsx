import React, { Suspense } from "react"

import Logo from "~/components/nav-bar/Logo"
import { ProfileCard } from "~/components/nav-bar/ProfileCard"
import Navbar from "~/lib/surfaces/navbar/Navbar"

export default async function BaseLayoutWithNavbar({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar
        leftContent={<Logo />}
        rightContent={
          <Suspense>
            <ProfileCard />
          </Suspense>
        }
      />
      {children}
    </div>
  )
}

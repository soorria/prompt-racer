import React, { Suspense } from "react"

import { Footer } from "~/components/Footer"
import Logo from "~/components/nav-bar/Logo"
import { ProfileCard } from "~/components/nav-bar/ProfileCard"
import Navbar from "~/lib/surfaces/navbar/Navbar"

export default async function BaseLayoutWithNavbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex h-full max-w-7xl flex-col">
      <Navbar
        leftContent={<Logo />}
        rightContent={
          <Suspense>
            <ProfileCard />
          </Suspense>
        }
      />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

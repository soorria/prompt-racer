import React, { Suspense } from "react"

import Logo from "~/components/nav-bar/Logo"
import { ProfileCard } from "~/components/nav-bar/ProfileCard"
import Navbar from "~/lib/surfaces/navbar/Navbar"
import { TRPCReactProvider } from "~/lib/trpc/react"

export default async function BaseLayoutWithNavbar({ children }: { children: React.ReactNode }) {
  return (
    <TRPCReactProvider>
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
    </TRPCReactProvider>
  )
}

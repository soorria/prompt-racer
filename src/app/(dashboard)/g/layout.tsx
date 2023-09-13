"use client"
import { ReactNode } from "react"
import { Authenticated, Unauthenticated } from "convex/react"
import BrandLoadingIndicator from "~/components/BrandLoadingIndicator"
import NavBar from "~/components/NavBar"

const MainLayout = (props: { children: ReactNode }) => {
  return (
    <>
      <Authenticated>
        <NavBar />
        <main className="flex-1">{props.children}</main>
      </Authenticated>
      <Unauthenticated>
        <div className="h-full grid place-items-center">
          <BrandLoadingIndicator />
        </div>
      </Unauthenticated>
    </>
  )
}

export default MainLayout

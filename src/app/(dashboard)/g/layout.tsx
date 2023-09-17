"use client"
import { ReactNode } from "react"
import { Authenticated, Unauthenticated } from "convex/react"
import BrandLoadingIndicator from "~/components/BrandLoadingIndicator"

const MainLayout = (props: { children: ReactNode }) => {
  return (
    <>
      <Unauthenticated>
        <div className="h-full grid place-items-center">
          <BrandLoadingIndicator />
        </div>
      </Unauthenticated>
      <Authenticated>{props.children}</Authenticated>
    </>
  )
}

export default MainLayout

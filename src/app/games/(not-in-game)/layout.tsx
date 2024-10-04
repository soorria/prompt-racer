import React from "react"

import BaseLayoutWithNavbar from "~/app/(landing)/layout"

export default async function layout({ children }: { children: React.ReactNode }) {
  return <BaseLayoutWithNavbar>{children}</BaseLayoutWithNavbar>
}

import { ReactNode } from "react"
import NavBar from "~/components/NavBar"

const DashboardLayout = (props: { children: ReactNode }) => {
  return (
    <div className="space-y-4 h-full flex flex-col">
      <NavBar />
      <main className="flex-1">{props.children}</main>
    </div>
  )
}

export default DashboardLayout

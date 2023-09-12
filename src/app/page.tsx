import NavBar from "~/components/NavBar"
import PanelSkeleton from "~/components/PanelSkeleton"
import { cookies } from "next/headers"

export default function Home() {
  const layout = cookies().get("react-resizable-panels:layout")
  const topLayout = cookies().get("react-resizable-panels:top-layout")

  let defaultLayout
  if (layout) {
    defaultLayout = JSON.parse(layout.value)
  }
  let defaultTopLayout
  if (topLayout) {
    defaultTopLayout = JSON.parse(topLayout.value)
  }

  return (
    <main className="h-full flex flex-col">
      <NavBar />
      <PanelSkeleton defaultLayout={defaultLayout} defaultTopLayout={defaultTopLayout} />
    </main>
  )
}

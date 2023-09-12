import NavBar from "~/components/NavBar"
import PanelSkeleton, { LayoutType } from "~/components/PanelSkeleton"
import { cookies } from "next/headers"
import GameSelector from "~/components/GameSelector"

export default function Home() {
  const layoutCookie = cookies().get("react-resizable-panels:layout")
  let defaultLayout

  if (layoutCookie) {
    try {
      defaultLayout = JSON.parse(layoutCookie.value) as LayoutType
    } catch (error) {
      throw new Error("Failed to parse layout from cookie.")
    }
  }

  return (
    <>
      {/* <PanelSkeleton defaultLayout={defaultLayout} /> */}
      <GameSelector />
    </>
  )
}

"use client"

import React from "react"
import dynamic from "next/dynamic"
import { useMediaQuery } from "@react-hook/media-query"
import { LayoutTemplate } from "lucide-react"

import CodeView from "~/components/game-screen/code-view/CodeView"
import { GameManagerProvider } from "~/components/game-screen/GameManagerProvider"
import ResponsiveMultiSelectPanel from "~/components/game-screen/multi-select-panel/ResponsiveMultiSelectPanel"
import QuestionDescription from "~/components/game-screen/question-description/QuestionDescription"
import { Skeleton } from "~/components/ui/skeleton"
import { createDefaultLayout, createDefaultMobileLayout } from "~/lib/surfaces/panels/layouts"
import PanelSkeleton from "~/lib/surfaces/panels/PanelSkeleton"

const CodeViewImpl = { key: "code", className: "bg-dracula p-4", component: <CodeView /> }
const CodeViewImpl1 = { key: "code1", className: "bg-dracula p-4", component: <CodeView /> }
const QuestionViewImpl = {
  key: "qdesc",
  className: "bg-card p-4",
  component: <QuestionDescription />,
}
const QuestionViewImpl2 = {
  key: "qdesc2",
  className: "bg-card p-4",
  component: <QuestionDescription />,
}
const Test = {
  key: "qdesc3",
  className: "",
  component: (
    <ResponsiveMultiSelectPanel
      panels={[
        { ...CodeViewImpl1, title: "Question" },
        { ...QuestionViewImpl, title: "More..." },
      ]}
    />
  ),
}

function GamePage() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const defaultDesktopLayout = createDefaultLayout({
    leftSection: { top: CodeViewImpl, bottom: QuestionViewImpl },
    rightSection: QuestionViewImpl2,
  })
  const defaultMobileLayout = createDefaultMobileLayout({
    top: Test,
    bottom: CodeViewImpl,
  })
  const layout = isMobile ? defaultMobileLayout : defaultDesktopLayout

  return (
    <GameManagerProvider>
      <PanelSkeleton layout={layout} />
    </GameManagerProvider>
  )
}

export default dynamic(() => Promise.resolve(GamePage), {
  loading: () => (
    <Skeleton className="grid h-full place-items-center">
      <LayoutTemplate className="h-72 w-72 animate-bounce text-white/10" />
    </Skeleton>
  ),
  ssr: false,
})

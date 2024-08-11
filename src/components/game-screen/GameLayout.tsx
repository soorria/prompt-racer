"use client"

import React from "react"
import dynamic from "next/dynamic"
import { useMediaQuery } from "@react-hook/media-query"
import { LayoutTemplate } from "lucide-react"
import { Doc } from "prettier"

import ChatHistoryPanel from "~/components/game-screen/ChatHistoryPanel"
import CodeView from "~/components/game-screen/CodeView"
import { GameManagerProvider } from "~/components/game-screen/GameManagerProvider"
import QuestionDescription from "~/components/game-screen/QuestionDescription"
import ResponsiveMultiSelectPanel from "~/components/game-screen/ResponsiveMultiSelectPanel"
import { Skeleton } from "~/components/ui/skeleton"
import { GameWithQuestion, SessionInfo } from "~/lib/games/types"
import { createDefaultLayout, createDefaultMobileLayout } from "~/lib/surfaces/panels/layouts"
import PanelSkeleton from "~/lib/surfaces/panels/PanelSkeleton"

const CodeViewImpl = { key: "code", className: "bg-dracula p-4", component: <CodeView /> }
const QuestionViewImpl = {
  key: "qdesc",
  className: "bg-card p-4",
  component: <QuestionDescription />,
}
const ChatHistoryPanelImpl = {
  key: "chat",
  className: "bg-card",
  component: <ChatHistoryPanel />,
}

const ResponsiveLayout = {
  key: "responsive-layout",
  className: "",
  component: (
    <ResponsiveMultiSelectPanel
      panels={[
        { ...QuestionViewImpl, title: "Question" },
        { ...ChatHistoryPanelImpl, title: "Chat log" },
      ]}
    />
  ),
}

function GameLayout({
  gameInfo,
  sessionInfo,
}: {
  gameInfo: GameWithQuestion
  sessionInfo: SessionInfo
}) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const defaultDesktopLayout = createDefaultLayout({
    rightSection: { top: CodeViewImpl, bottom: ChatHistoryPanelImpl },
    leftSection: QuestionViewImpl,
  })
  const defaultMobileLayout = createDefaultMobileLayout({
    top: ResponsiveLayout,
    bottom: CodeViewImpl,
  })
  const layout = isMobile ? defaultMobileLayout : defaultDesktopLayout

  return (
    <GameManagerProvider gameInfo={gameInfo} sessionInfo={sessionInfo}>
      <PanelSkeleton layout={layout} />
    </GameManagerProvider>
  )
}

export default dynamic(() => Promise.resolve(GameLayout), {
  loading: () => (
    <Skeleton className="grid h-full place-items-center">
      <LayoutTemplate className="h-72 w-72 animate-bounce text-white/10" />
    </Skeleton>
  ),
  ssr: false,
})

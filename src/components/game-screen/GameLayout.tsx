"use client"

import React from "react"
import dynamic from "next/dynamic"
import { useMediaQuery } from "@react-hook/media-query"
import { LayoutTemplate } from "lucide-react"

import type { GameStateWithQuestion, PlayerGameSession } from "~/lib/games/types"
import { ChatHistoryPanelImpl } from "~/components/game-screen/ChatHistoryPanel"
import CodeView from "~/components/game-screen/CodeView"
import { GameManagerProvider } from "~/components/game-screen/GameManagerProvider"
import MobileMultiSelectPanel from "~/components/game-screen/MobileMultiSelectPanel"
import QuestionDescription from "~/components/game-screen/QuestionDescription"
import { Skeleton } from "~/components/ui/skeleton"
import { createDefaultLayout, createDefaultMobileLayout } from "~/lib/surfaces/panels/layouts"
import PanelSkeleton from "~/lib/surfaces/panels/PanelSkeleton"
import MultiSelectPanel from "./MultiSelectPanel"
import RunCodePanel from "./RunCodePanel"

const CodeViewImpl = {
  key: "code",
  className: "bg-dracula p-4 flex flex-col",
  component: <CodeView />,
}
const QuestionViewImpl = {
  key: "qdesc",
  className: "bg-card p-4",
  component: <QuestionDescription />,
}
const CodeRunningViewImpl = {
  key: "run-code",
  className: "bg-card p-4",
  component: <RunCodePanel />,
}

const MobileLayout = {
  key: "mobile-layout",
  className: "",
  component: (
    <MobileMultiSelectPanel
      panels={[
        { ...QuestionViewImpl, title: "Question" },
        { ...CodeRunningViewImpl, title: "Run code" },
        { ...ChatHistoryPanelImpl, title: "Chat log" },
      ]}
    />
  ),
}

const QuestionAndTestCasesImpl = {
  key: "question-and-testcases",
  className: "bg-card",
  component: (
    <MultiSelectPanel
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
  gameInfo: GameStateWithQuestion
  sessionInfo: PlayerGameSession
}) {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const defaultDesktopLayout = createDefaultLayout({
    rightSection: { top: CodeViewImpl, bottom: CodeRunningViewImpl },
    leftSection: QuestionAndTestCasesImpl,
  })
  const defaultMobileLayout = createDefaultMobileLayout({
    top: CodeViewImpl,
    bottom: MobileLayout,
  })
  const layout = isMobile ? defaultMobileLayout : defaultDesktopLayout

  return (
    <GameManagerProvider initialGameState={gameInfo} initialPlayerSession={sessionInfo}>
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

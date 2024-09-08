"use client"

import React from "react"
import dynamic from "next/dynamic"
import { useMediaQuery } from "@react-hook/media-query"
import { LayoutTemplate } from "lucide-react"

import { ChatHistoryPanelImpl } from "~/components/game-screen/ChatHistoryPanel"
import MobileMultiSelectPanel from "~/components/game-screen/MobileMultiSelectPanel"
import QuestionDescription from "~/components/game-screen/QuestionDescription"
import { Skeleton } from "~/components/ui/skeleton"
import { createDefaultLayout, createDefaultMobileLayout } from "~/lib/surfaces/panels/layouts"
import PanelSkeleton from "~/lib/surfaces/panels/PanelSkeleton"
import { CodeViewImpl } from "./CodeView"
import MultiSelectPanel from "./MultiSelectPanel"
import RunCodePanel from "./RunCodePanel"

export const MOBILE_VIEWPORT = "(max-width: 640px)"

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

function InProgressGameImpl() {
  const isMobile = useMediaQuery(MOBILE_VIEWPORT)
  const defaultDesktopLayout = createDefaultLayout({
    rightSection: { top: CodeViewImpl, bottom: CodeRunningViewImpl },
    leftSection: QuestionAndTestCasesImpl,
  })
  const defaultMobileLayout = createDefaultMobileLayout({
    top: CodeViewImpl,
    bottom: MobileLayout,
  })
  const layout = isMobile ? defaultMobileLayout : defaultDesktopLayout

  return <PanelSkeleton layout={layout} />
}

export const InProgressGame = dynamic(() => Promise.resolve(InProgressGameImpl), {
  loading: () => (
    <Skeleton className="grid h-full place-items-center">
      <LayoutTemplate className="h-72 w-72 animate-bounce text-white/10" />
    </Skeleton>
  ),
  ssr: false,
})

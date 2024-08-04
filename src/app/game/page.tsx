"use server"

import React from "react"

import CodeView from "~/components/game-screen/code-view/CodeView"
import { GameManagerProvider } from "~/components/game-screen/GameManagerProvider"
import QuestionDescription from "~/components/game-screen/question-description/QuestionDescription"
import { createDefaultLayout, createDefaultMobileLayout } from "~/lib/surfaces/panels/layouts"
import PanelSkeleton from "~/lib/surfaces/panels/PanelSkeleton"
import { updateLayoutSizingFromCookies } from "~/lib/surfaces/panels/persistance"

export default async function GamePage() {
  const CodeViewImpl = { key: "code", className: "bg-dracula p-4", component: <CodeView /> }
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

  const defaultDesktopLayout = createDefaultLayout({
    leftSection: { top: CodeViewImpl, bottom: QuestionViewImpl },
    rightSection: QuestionViewImpl2,
  })
  const defaultMobileLayout = createDefaultMobileLayout({
    top: QuestionViewImpl,
    bottom: CodeViewImpl,
  })

  const updatedDesktopLayout = updateLayoutSizingFromCookies(defaultDesktopLayout)
  const updatedMobileLayout = updateLayoutSizingFromCookies(defaultMobileLayout)
  if (!updatedDesktopLayout || !updatedMobileLayout) {
    return <div>Failed to load game</div>
  }
  return (
    <GameManagerProvider>
      {/* TODO: additionally pass in mobile layout and let panel skeleton decide which one to use */}
      <PanelSkeleton desktopLayout={updatedDesktopLayout} mobileLayout={updatedMobileLayout} />
    </GameManagerProvider>
  )
}

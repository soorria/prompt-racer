"use client"

import React, { useMemo } from "react"
import { useMediaQuery } from "@react-hook/media-query"

import type { ClientQuestionStrategy } from "~/lib/games/question-types/base"
import { getQuestionType } from "~/lib/games/question-types/base"
import { createClientQuestionStrategy } from "~/lib/games/question-types/client_create"
import { type NotWaitingForPlayersGameState } from "~/lib/games/types"
import { createDefaultLayout, createDefaultMobileLayout } from "~/lib/surfaces/panels/layouts"
import MobileMultiSelectPanel from "~/lib/surfaces/panels/MobileMultiSelectPanel"
import MultiSelectPanel from "~/lib/surfaces/panels/MultiSelectPanel"
import PanelSkeleton from "~/lib/surfaces/panels/PanelSkeleton"
import ChatHistoryPanel from "./ChatHistoryPanel"
import CodeView from "./CodeView"

export const MOBILE_VIEWPORT = "(max-width: 640px)"

function useGamePanels(questionStrategy: ClientQuestionStrategy) {
  return useMemo(() => {
    const descriptionPanel = questionStrategy.descriptionPanel()
    const resultsPanel = questionStrategy.resultsPanel()

    return {
      question: {
        key: "description",
        className: "bg-card p-4",
        component: descriptionPanel.content,
        title: "Question",
      },
      codeView: {
        key: "code",
        className: "bg-dracula p-2 sm:p-4 flex flex-col",
        component: <CodeView />,
      },
      codeRunning: {
        key: "run-code",
        className: "p-4",
        component: resultsPanel.content,
        footer: resultsPanel.footer,
        footerClassName: "px-4 pb-4 pt-2",
        title: "Run code",
      },
      chatHistory: {
        key: "chat",
        className: "bg-card",
        component: <ChatHistoryPanel />,
        title: "Chat log",
      },
    }
  }, [questionStrategy])
}

export function InProgressGame(props: { gameInfo: NotWaitingForPlayersGameState }) {
  const isMobile = useMediaQuery(MOBILE_VIEWPORT)
  const questionType = getQuestionType(props.gameInfo.question)
  const questionStrategy = createClientQuestionStrategy(questionType, props.gameInfo.question)
  const panels = useGamePanels(questionStrategy)

  const mobileTabsPanel = {
    key: "mobile-layout",
    component: (
      <MobileMultiSelectPanel
        panels={[
          panels.question,
          { ...panels.codeRunning, footerClassName: "p-0" },
          panels.chatHistory,
        ]}
      />
    ),
  }
  const questionAndChatPanel = {
    key: "question-and-chat",
    className: "bg-card",
    component: <MultiSelectPanel panels={[panels.question, panels.chatHistory]} />,
  }

  const layout = isMobile
    ? createDefaultMobileLayout({
        top: panels.codeView,
        bottom: mobileTabsPanel,
      })
    : createDefaultLayout({
        rightSection: {
          top: panels.codeView,
          bottom: panels.codeRunning,
        },
        leftSection: questionAndChatPanel,
      })
  return <PanelSkeleton layout={layout} />
}

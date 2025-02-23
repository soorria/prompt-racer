"use client"

import React, { useMemo } from "react"
import { useMediaQuery } from "@react-hook/media-query"

import type { ClientQuestionStrategy } from "~/lib/games/question-types/base"
import { ChatHistoryPanelImpl } from "~/components/game-screen/ChatHistoryPanel"
import MobileMultiSelectPanel from "~/components/game-screen/MobileMultiSelectPanel"
import QuestionDescription from "~/components/game-screen/QuestionDescription"
import { getQuestionType } from "~/lib/games/question-types/base"
import { createClientQuestionStrategy } from "~/lib/games/question-types/client_create"
import { type NotWaitingForPlayersGameState } from "~/lib/games/types"
import { createDefaultLayout, createDefaultMobileLayout } from "~/lib/surfaces/panels/layouts"
import PanelSkeleton from "~/lib/surfaces/panels/PanelSkeleton"
import CodeRunningFooter from "./CodeRunningFooter"
import { CodeViewImpl } from "./CodeView"
import MultiSelectPanel from "./MultiSelectPanel"
import RunCodePanel from "./RunCodePanel"

export const MOBILE_VIEWPORT = "(max-width: 640px)"

function useViews(props: {
  gameInfo: NotWaitingForPlayersGameState
  questionStrategy: ClientQuestionStrategy
}) {
  return useMemo(() => {
    const QuestionViewImpl = {
      key: "description",
      className: "bg-card p-4",
      component: (
        <QuestionDescription
          questionStrategy={props.questionStrategy}
          gameMode={props.gameInfo.mode}
        />
      ),
    }
    const CodeRunningViewImpl = {
      key: "run-code",
      className: "p-4",
      component: <RunCodePanel />,
      footer: <CodeRunningFooter />,
      footerClassName: "px-4 pb-4 pt-2",
    }

    const MobileLayout = {
      key: "mobile-layout",
      className: "",
      component: (
        <MobileMultiSelectPanel
          panels={[
            { ...QuestionViewImpl, title: "Question" },
            { ...CodeRunningViewImpl, title: "Run code", footerClassName: "p-0" },
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

    return {
      MobileLayout,
      QuestionAndTestCasesImpl,
      CodeRunningViewImpl,
    }
  }, [props.gameInfo.mode, props.questionStrategy])
}

export function InProgressGame(props: { gameInfo: NotWaitingForPlayersGameState }) {
  const isMobile = useMediaQuery(MOBILE_VIEWPORT)
  const questionType = getQuestionType(props.gameInfo.question)
  const questionStrategy = createClientQuestionStrategy(questionType, props.gameInfo.question)
  const { MobileLayout, QuestionAndTestCasesImpl, CodeRunningViewImpl } = useViews({
    gameInfo: props.gameInfo,
    questionStrategy,
  })
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

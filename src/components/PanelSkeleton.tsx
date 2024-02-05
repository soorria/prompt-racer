"use client"
import React, { useEffect, useState } from "react"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import DescriptionPanel from "./DescriptionPanel"
import CodePanel from "./CodePanel"
import ChatPanel, { ChatPanelProps } from "./ChatPanel"
import { cx } from "class-variance-authority"
import LeaderboardPanel from "./LeaderboardPanel"
import { Doc } from "~convex/dataModel"
import { api } from "~convex/api"
import { InferQueryOutput } from "~/lib/convex"
import { useAction, useMutation } from "convex/react"
import LiveGameStats from "./LiveGameStats"
import { debounce } from "~/lib/utils"
import { useTwBreakpoint } from "~/lib/use-tw-breakpoint"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"
import { TabsContent } from "@radix-ui/react-tabs"

export type LayoutType = {
  left?: number
  right?: number
  tl?: number
  tr?: number
  bl?: number
  br?: number
}

interface PanelSkeletonProps {
  defaultLayout?: LayoutType
  chatPanelProps: ChatPanelProps
  question: Doc<"game">["question"]
  game: NonNullable<InferQueryOutput<typeof api.games.getGameInfoForUser>["game"]>
  playerGameInfo: InferQueryOutput<typeof api.games.getGameInfoForUser>["currentPlayerInfo"]
}

const ResizeHandle = ({
  orientation = "horizontal",
}: {
  orientation?: "horizontal" | "vertical"
}) => (
  <PanelResizeHandle
    className={cx(
      orientation === "vertical" ? "w-1" : "h-1",
      "flex flex-col justify-center items-center"
    )}
  >
    <div
      className={cx(
        orientation === "vertical" ? "h-1/6 w-1" : "h-1 w-1/6",
        "bg-white/10 rounded-full"
      )}
    />
  </PanelResizeHandle>
)

export type AiMessageType = Extract<Doc<"playerGameInfo">["chatHistory"][number], { role: "ai" }>
const getCodeToDisplayInfo = (args: {
  game: PanelSkeletonProps["game"]
  messages: Doc<"playerGameInfo">["chatHistory"]
}) => {
  const lastMessage = args.messages.at(-1)

  if (lastMessage?.role === "ai") {
    const parsed = lastMessage.parsed
    if (parsed.state === "generating") {
      return { code: parsed.maybeCode, generating: true }
    } else if (parsed.state === "success") {
      return { code: parsed.code }
    }
  }

  return {
    code: args.game.question.starting_code,
  }
}

export default function PanelSkeleton({
  defaultLayout = { left: 50, right: 50, tl: 70, bl: 30, tr: 35, br: 65 },
  chatPanelProps,
  question,
  game,
  playerGameInfo,
}: PanelSkeletonProps) {
  const [panelSizes, setPanelSizes] = useState<LayoutType>(defaultLayout)
  const { left, right, tl, bl, tr, br } = panelSizes
  const showResizerUI = useTwBreakpoint("sm")

  const [direction, setDirection] = useState<"vertical" | "horizontal">(
    window.innerWidth < 768 ? "vertical" : "horizontal"
  )

  useEffect(() => {
    const handleResize = debounce(() => {
      if (window.innerWidth < 768 && direction !== "vertical") {
        setDirection("vertical")
      } else if (window.innerWidth >= 768 && direction !== "horizontal") {
        setDirection("horizontal")
      }
    }, 150)

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [direction])

  useEffect(() => {
    document.cookie = `react-resizable-panels:layout=${JSON.stringify(panelSizes)}`
  }, [panelSizes])

  const updatePanelSizes = (updatedSizes: Partial<LayoutType>) =>
    setPanelSizes((prevSizes) => ({ ...prevSizes, ...updatedSizes }))

  const handleLayout = (keys: string[]) => (sizes: number[]) => {
    const newSizes = Object.fromEntries(keys.map((key, idx) => [key, sizes[idx]]))
    updatePanelSizes(newSizes)
  }

  const runTests = useAction(api.games.runTests)
  const submitCode = useAction(api.games.submitCode)
  const resetCode = useMutation(api.games.resetStartingCode)

  const codeInfo = getCodeToDisplayInfo({ game, messages: chatPanelProps.messages })

  const panels = {
    description: (
      <DescriptionPanel
        question={question}
        gameMode={game.mode}
        playerGameInfo={playerGameInfo}
        onRunTests={() => runTests({ gameId: game._id })}
        onSubmitCode={() => submitCode({ gameId: game._id })}
      />
    ),
    timer: <LiveGameStats game={game} />,
    code: (
      <CodePanel
        code={codeInfo.code}
        generating={codeInfo.generating}
        onMessageSend={chatPanelProps.onMessageSend}
        onResetCode={() => resetCode({ gameId: game._id })}
        sending={chatPanelProps.sending}
      />
    ),
    changelog: (
      <ChatPanel
        messages={chatPanelProps.messages}
        onMessageSend={chatPanelProps.onMessageSend}
        sending={chatPanelProps.sending}
      />
    ),
  }

  if (showResizerUI) {
    return (
      <PanelGroup
        direction={direction}
        onLayout={handleLayout(["left", "right"])}
        className="flex-1 gap-1"
      >
        <Panel defaultSize={left}>
          <PanelGroup direction="vertical" onLayout={handleLayout(["tl", "bl"])} className="gap-1">
            <Panel defaultSize={tl}>{panels.description}</Panel>
            <ResizeHandle orientation="horizontal" />
            <Panel defaultSize={bl}>{panels.timer}</Panel>
          </PanelGroup>
        </Panel>
        {direction === "vertical" ? (
          <ResizeHandle orientation="horizontal" />
        ) : (
          <ResizeHandle orientation="vertical" />
        )}
        <Panel defaultSize={right}>
          <PanelGroup direction="vertical" onLayout={handleLayout(["tr", "br"])} className="gap-1">
            <Panel defaultSize={tr}>{panels.code}</Panel>
            <ResizeHandle orientation="horizontal" />
            <Panel defaultSize={br} className="relative">
              {panels.changelog}
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    )
  } else {
    return (
      <Tabs defaultValue="description" className="h-full flex flex-col bg-card rounded-md">
        <div className="flex-1 bg-card pb-2">
          <TabsContent className="h-full" value="description">
            {panels.description}
          </TabsContent>
          <TabsContent className="h-full" value="code">
            {panels.code}
          </TabsContent>
          <TabsContent className="h-full" value="timer">
            {panels.timer}
          </TabsContent>
          <TabsContent className="h-full" value="log">
            {panels.changelog}
          </TabsContent>
        </div>
        <TabsList className="w-full">
          <TabsTrigger value="description">Question</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="timer">Timer</TabsTrigger>
          <TabsTrigger value="log">Changelog</TabsTrigger>
        </TabsList>
      </Tabs>
    )
  }
}

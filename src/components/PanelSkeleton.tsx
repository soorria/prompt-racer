"use client"
import React, { useEffect, useState } from "react"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import DescriptionPanel from "./DescriptionPanel"
import CodePanel from "./CodePanel"
import ChatPanel from "./ChatPanel"
import { cx } from "class-variance-authority"
import LeaderboardPanel from "./LeaderboardPanel"

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

export default function PanelSkeleton({
  defaultLayout = { left: 50, right: 50, tl: 70, bl: 30, tr: 35, br: 65 },
}: PanelSkeletonProps) {
  const [panelSizes, setPanelSizes] = useState<LayoutType>(defaultLayout)
  const { left, right, tl, bl, tr, br } = panelSizes

  useEffect(() => {
    document.cookie = `react-resizable-panels:layout=${JSON.stringify(panelSizes)}`
  }, [panelSizes])

  const updatePanelSizes = (updatedSizes: Partial<LayoutType>) =>
    setPanelSizes((prevSizes) => ({ ...prevSizes, ...updatedSizes }))

  const handleLayout = (keys: string[]) => (sizes: number[]) => {
    const newSizes = Object.fromEntries(keys.map((key, idx) => [key, sizes[idx]]))
    updatePanelSizes(newSizes)
  }

  return (
    <PanelGroup
      direction="horizontal"
      onLayout={handleLayout(["left", "right"])}
      className="flex-1 gap-1"
    >
      <Panel defaultSize={left}>
        <PanelGroup direction="vertical" onLayout={handleLayout(["tl", "bl"])} className="gap-1">
          <Panel defaultSize={tl}>
            <DescriptionPanel />
          </Panel>
          <ResizeHandle orientation="horizontal" />
          <Panel defaultSize={bl}>
            <LeaderboardPanel />
          </Panel>
        </PanelGroup>
      </Panel>
      <ResizeHandle orientation="vertical" />
      <Panel defaultSize={right}>
        <PanelGroup direction="vertical" onLayout={handleLayout(["tr", "br"])} className="gap-1">
          <Panel defaultSize={tr}>
            <CodePanel />
          </Panel>
          <ResizeHandle orientation="horizontal" />
          <Panel defaultSize={br} className="relative">
            {/* <ChatPanel /> */}
          </Panel>
        </PanelGroup>
      </Panel>
    </PanelGroup>
  )
}

"use client"
import React from "react"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import DescriptionPanel from "./DescriptionPanel"
import CodePanel from "./CodePanel"
import ChatPanel from "./ChatPanel"

type Props = {}

export default function PanelSkeleton({
  defaultLayout = [33, 67],
  defaultTopLayout = [33, 67],
}: {
  defaultLayout: number[] | undefined
  defaultTopLayout: number[] | undefined
}) {
  const onLayout = (sizes: number[]) => {
    document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`
  }
  const onTopLayout = (sizes: number[]) => {
    document.cookie = `react-resizable-panels:top-layout=${JSON.stringify(sizes)}`
  }
  return (
    <PanelGroup direction="vertical" onLayout={onLayout} className="mt-4 flex-1">
      <Panel defaultSize={defaultLayout[0]}>
        <PanelGroup direction="horizontal" onLayout={onTopLayout}>
          <Panel defaultSize={defaultTopLayout[0]}>
            <DescriptionPanel />
          </Panel>
          <PanelResizeHandle className="w-2 bg-zinc-800" />
          <Panel defaultSize={defaultTopLayout[1]}>
            <CodePanel />
          </Panel>
        </PanelGroup>
      </Panel>
      <PanelResizeHandle className="h-2 bg-zinc-800" />
      <Panel defaultSize={defaultLayout[1]}>
        <ChatPanel />
      </Panel>
    </PanelGroup>
  )
}

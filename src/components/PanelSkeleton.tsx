"use client"
import React from "react"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import DescriptionPanel from "./DescriptionPanel"
import CodePanel from "./CodePanel"
import ChatPanel from "./ChatPanel"

type Props = {}

export default function PanelSkeleton({
  defaultLayout = [33, 67, 99, 99],
}: {
  defaultLayout: number[] | undefined
}) {
  const onLayout = (sizes: number[]) => {
    document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`
  }
  return (
    <PanelGroup direction="vertical" onLayout={onLayout} className="py-4">
      <Panel defaultSize={defaultLayout[1]}>
        <PanelGroup direction="horizontal">
          <Panel defaultSize={defaultLayout[2]}>
            <DescriptionPanel />
          </Panel>
          <PanelResizeHandle className="w-2 bg-zinc-800" />
          <Panel defaultSize={defaultLayout[3]}>
            <CodePanel />
          </Panel>
        </PanelGroup>
      </Panel>
      <PanelResizeHandle className="h-2 bg-zinc-800" />
      <Panel defaultSize={defaultLayout[0]}>
        <ChatPanel />
      </Panel>
    </PanelGroup>
  )
}

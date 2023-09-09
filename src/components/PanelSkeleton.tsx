"use client"
import React, { useEffect, useState } from "react"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import DescriptionPanel from "./DescriptionPanel"
import CodePanel from "./CodePanel"
import ChatPanel from "./ChatPanel"

type LayoutType = {
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

export default function PanelSkeleton({
  defaultLayout = {
    left: 50,
    right: 50,
    tl: 70,
    bl: 30,
    tr: 35,
    br: 65,
  },
}: PanelSkeletonProps) {
  const [panelSizes, setPanelSizes] = useState<LayoutType>(defaultLayout)

  useEffect(() => {
    document.cookie = `react-resizable-panels:layout=${JSON.stringify(panelSizes)}`
  }, [panelSizes])

  const updatePanelSizes = (updatedSizes: Partial<LayoutType>) => {
    setPanelSizes((prevSizes) => ({ ...prevSizes, ...updatedSizes }))
  }

  const handleLeftRightLayout = (sizes: number[]) => {
    updatePanelSizes({ left: sizes[0], right: sizes[1] })
  }

  const handleLeftLayout = (sizes: number[]) => {
    updatePanelSizes({ tl: sizes[0], bl: sizes[1] })
  }

  const handleRightLayout = (sizes: number[]) => {
    updatePanelSizes({ tr: sizes[0], br: sizes[1] })
  }

  return (
    <PanelGroup
      direction="horizontal"
      onLayout={handleLeftRightLayout}
      className="mt-4 flex-1 gap-1"
    >
      <Panel defaultSize={panelSizes.left}>
        <PanelGroup direction="vertical" onLayout={handleLeftLayout} className="gap-1">
          <Panel defaultSize={panelSizes.tl}>
            <DescriptionPanel />
          </Panel>
          <PanelResizeHandle className="h-2 flex flex-col justify-center items-center">
            <div className="h-1 w-1/6 bg-white/10 rounded-full" />
          </PanelResizeHandle>
          <Panel defaultSize={panelSizes.bl}>
            <CodePanel />
          </Panel>
        </PanelGroup>
      </Panel>
      <PanelResizeHandle className="w-1 flex flex-col justify-center items-center">
        <div className="h-1/6 w-1 bg-white/10 rounded-full" />
      </PanelResizeHandle>
      <Panel defaultSize={panelSizes.right}>
        <PanelGroup direction="vertical" onLayout={handleRightLayout} className="gap-1">
          <Panel defaultSize={panelSizes.tr}>
            <ChatPanel />
          </Panel>
          <PanelResizeHandle className="h-2 flex flex-col justify-center items-center">
            <div className="h-1 w-1/6 bg-white/10 rounded-full" />
          </PanelResizeHandle>{" "}
          <Panel defaultSize={panelSizes.br}>
            <ChatPanel />
          </Panel>
        </PanelGroup>
      </Panel>
    </PanelGroup>
  )
}

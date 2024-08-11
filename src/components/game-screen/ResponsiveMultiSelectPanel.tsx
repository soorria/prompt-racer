"use client"

import React, { useState } from "react"
import { invariant } from "@epic-web/invariant"

import type { PanelSlot } from "~/lib/surfaces/panels/panels"
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { cn } from "~/lib/utils"

export type PanelSlotWithTitle = PanelSlot & { title: string }

export default function ResponsiveMultiSelectPanel({ panels }: { panels: PanelSlotWithTitle[] }) {
  const [selectedPanelIndex, setSelectedPanelIndex] = useState(0)

  const handlePanelChange = (key: string) => {
    setSelectedPanelIndex(panels.findIndex((panel) => panel.key === key))
  }

  const selectedPanel = panels[selectedPanelIndex]
  invariant(selectedPanel, "selectedPanel should not be undefined")

  return (
    <div className="flex h-full flex-col">
      <div
        key={panels[selectedPanelIndex]?.key}
        className={cn(panels[selectedPanelIndex]?.className, "flex-1 pb-20")}
        style={{ overflow: "scroll" }}
      >
        {panels[selectedPanelIndex]?.component}
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10 grid place-content-center bg-gradient-to-t from-card/40 p-3">
        <Tabs defaultValue={panels[0]?.key} onValueChange={handlePanelChange} className="w-full">
          <TabsList className="space-x-3 rounded-full px-2 py-6 ring-2 ring-primary/50">
            {panels.map((panel) => (
              <TabsTrigger key={panel.key} value={panel.key} className="rounded-full p-2">
                {panel.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}

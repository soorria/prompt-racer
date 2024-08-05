"use client"

import React, { useState } from "react"

import type { PanelSlot } from "~/lib/surfaces/panels/panels"
import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"

export type PanelSlotWithTitle = PanelSlot & { title: string }

export default function ResponsiveMultiSelectPanel({ panels }: { panels: PanelSlotWithTitle[] }) {
  const [selectedPanelIndex, setSelectedPanelIndex] = useState(0)

  const handlePanelChange = (index: number) => {
    setSelectedPanelIndex(index)
  }

  return (
    <div className="flex h-full flex-col">
      <div
        key={panels[selectedPanelIndex]?.key}
        className={cn(panels[selectedPanelIndex]?.className, "flex-1 pb-20")}
        style={{ overflow: "scroll" }}
      >
        {panels[selectedPanelIndex]?.component}
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10">
        <nav
          aria-label="Tabs"
          className="flex justify-center space-x-4 border-t-4 border-t-lime-200/5 bg-card p-3"
        >
          {panels.map((panel, index) => (
            <Button
              key={panel.key}
              aria-current={index === selectedPanelIndex}
              variant={index === selectedPanelIndex ? "default" : "ghost"}
              onClick={() => handlePanelChange(index)}
            >
              {panel.title}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  )
}

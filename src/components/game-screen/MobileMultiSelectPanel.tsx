"use client"

import React, { useState } from "react"
import { invariant } from "@epic-web/invariant"

import type { PanelSlot } from "~/lib/surfaces/panels/panels"
import { cn } from "~/lib/utils"
import AnimatedTabs from "../ui/AnimatedTabs"

export type PanelSlotWithTitle = PanelSlot & { title: string }

export default function ResponsiveMultiSelectPanel({ panels }: { panels: PanelSlotWithTitle[] }) {
  const [selectedPanelIndex, setSelectedPanelIndex] = useState(0)

  const handlePanelChange = (key: string) => {
    setSelectedPanelIndex(panels.findIndex((panel) => panel.key === key))
  }

  const selectedPanel = panels[selectedPanelIndex]
  invariant(selectedPanel, "selectedPanel should not be undefined")

  return (
    <div className="mb-16">
      <div className={cn("flex h-full flex-col gap-6", selectedPanel?.className)}>
        {selectedPanel.component}
        {selectedPanel.footer && (
          <div className={cn(selectedPanel.footerClassName)}>{selectedPanel.footer}</div>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10 grid place-content-center bg-gradient-to-t from-card/40 p-3">
        <div className="flex flex-row gap-x-2 rounded-full bg-card-lighter p-2 ring-2 ring-green-800">
          <AnimatedTabs
            interaction="click"
            value={selectedPanel.key}
            className="rounded-full bg-white dark:bg-zinc-700"
            transition={{
              ease: "easeInOut",
              duration: 0.2,
            }}
            onChange={(key) => {
              handlePanelChange(key)
            }}
          >
            {panels.map((panel) => (
              <button
                key={panel.key}
                data-id={panel.key}
                type="button"
                className={cn(
                  "inline-flex w-20 items-center justify-center p-0.5 text-center text-zinc-50/50 transition-all active:scale-[0.98]",
                  { "text-zinc-800": selectedPanel.key === panel.key },
                )}
              >
                {panel.title}
              </button>
            ))}
          </AnimatedTabs>
        </div>
      </div>
    </div>
  )
}

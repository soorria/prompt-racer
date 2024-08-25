import React, { useState } from "react"
import { invariant } from "@epic-web/invariant"

import type { PanelSlot } from "~/lib/surfaces/panels/panels"
import { cn } from "~/lib/utils"
import AnimatedTabs from "../ui/AnimatedTabs"

export type PanelSlotWithTitle = PanelSlot & { title: string }

export default function MultiSelectPanel({ panels }: { panels: PanelSlotWithTitle[] }) {
  const [selectedPanel, setSelectedPanel] = useState(panels[0])

  const handlePanelChange = (panel: string | null) => {
    if (panel) {
      setSelectedPanel(panels.find((p) => p.key === panel))
    }
  }

  invariant(selectedPanel, "selectedPanel should not be undefined")

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-row gap-x-2 rounded-t-xl bg-card-lighter p-2 drop-shadow-lg">
        <AnimatedTabs
          interaction="click"
          value={selectedPanel.key}
          className="rounded-lg bg-white dark:bg-zinc-700"
          transition={{
            ease: "easeInOut",
            duration: 0.2,
          }}
          onChange={(key) => {
            handlePanelChange(key)
          }}
        >
          {panels.map((panel, index) => (
            <button
              key={index}
              data-id={panel.key}
              type="button"
              className={cn(
                "inline-flex w-20 items-center justify-center text-center text-zinc-50/50 transition-all active:scale-[0.98]",
                { "text-zinc-800": selectedPanel.key === panel.key },
              )}
            >
              {panel.title}
            </button>
          ))}
        </AnimatedTabs>
      </div>
      <div
        key={selectedPanel.key}
        className={cn(selectedPanel.className, "flex-1")}
        style={{ overflow: "scroll" }}
      >
        {selectedPanel.component}
      </div>
    </div>
  )
}

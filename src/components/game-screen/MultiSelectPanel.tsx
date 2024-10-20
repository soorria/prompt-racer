import React, { useState } from "react"
import { invariant } from "@epic-web/invariant"
import { AnimatePresence, motion } from "framer-motion"

import type { PanelSlot } from "~/lib/surfaces/panels/panels"
import { cn } from "~/lib/utils"
import AnimatedTabs from "../ui/AnimatedTabs"

export type PanelSlotWithTitle = PanelSlot & { title: string }

export enum Direction {
  Left = -1,
  Right = 1,
}

const transition = {
  type: "spring",
  duration: 0.4,
  bounce: 0.3,
}

export const directionalVariants = {
  enter: (direction: Direction) => ({
    x: direction * 100,
    opacity: 0,
  }),
  target: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: Direction) => ({
    x: direction * -100,
    opacity: 0,
  }),
}

export default function MultiSelectPanel({ panels }: { panels: PanelSlotWithTitle[] }) {
  const [selectedPanel, setSelectedPanel] = useState(panels[0])
  const [direction, setDirection] = useState<Direction>(Direction.Right)

  const handlePanelChange = (panel: string | null) => {
    if (panel && selectedPanel) {
      const currIdx = panels.findIndex((p) => p.key === selectedPanel.key)
      const nextIdx = panels.findIndex((p) => p.key === panel)

      setDirection(nextIdx > currIdx ? Direction.Right : Direction.Left)
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
          transition={transition}
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
      <AnimatePresence initial={false} mode="popLayout" custom={direction}>
        <motion.div
          key={selectedPanel.key}
          custom={direction}
          transition={transition}
          variants={directionalVariants}
          initial="enter"
          animate="target"
          exit="exit"
          className={cn(selectedPanel.className, "flex-1 no-scrollbar")}
          style={{ overflow: "scroll" }}
        >
          {selectedPanel.component}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

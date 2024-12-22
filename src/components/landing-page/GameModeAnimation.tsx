"use client"

import type { TargetAndTransition } from "framer-motion"
import React, { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowDownNarrowWide, Code, Gauge, Timer } from "lucide-react"

const GameModeAnimation = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  const modes = [
    { icon: Timer, text: "Speed Demon", color: "bg-orange-300" },
    { icon: Gauge, text: "Turbo Code", color: "bg-green-300" },
    { icon: ArrowDownNarrowWide, text: "Minimalist", color: "bg-purple-300" },
    { icon: Code, text: "AI Whisperer", color: "bg-blue-300" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % modes.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [activeIndex, modes.length]) // Reset interval when activeIndex changes

  const floatingAnimation = (index: number): TargetAndTransition => ({
    y: [0, -4, 0],
    transition: {
      duration: 2 + index * 0.2,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse",
      delay: index * 0.3,
    },
  })

  return (
    <div className="flex flex-col">
      <div className="mb-3 flex items-center gap-3">
        {modes.map((mode, index) => {
          const Icon = mode.icon
          const isActive = index === activeIndex

          return (
            <motion.div
              key={index}
              className={`flex cursor-pointer items-center rounded-3xl text-black ${mode.color} overflow-hidden p-2`}
              whileTap={{ scale: 0.9 }}
              animate={floatingAnimation(index)}
              onClick={() => setActiveIndex(index)}
            >
              <Icon className="sq-6" />
              <AnimatePresence mode="wait">
                {isActive && (
                  <motion.span
                    className="whitespace-nowrap"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                  >
                    {"⁠ "}
                    {mode.text}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
      <div className="text-center font-display text-white/70">GAME MODES</div>
    </div>
  )
}

export default GameModeAnimation

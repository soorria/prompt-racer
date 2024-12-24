"use client"

import type { TargetAndTransition } from "framer-motion"
import React, { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowDownNarrowWide, Code, Gauge, Timer } from "lucide-react"
import useMeasure from "react-use-measure"

const GameModeAnimation = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [measureRef, bounds] = useMeasure()
  const [measuredWidth, setMeasuredWidth] = useState(0)

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
  }, [activeIndex, modes.length])

  useEffect(() => {
    setMeasuredWidth(bounds.width)
  }, [bounds.width])

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
      {/* Hidden element for measuring text width */}
      <div className="invisible absolute" ref={measureRef}>
        {modes[activeIndex]?.text}
      </div>

      <div className="mb-3 flex items-center gap-3">
        {modes.map((mode, index) => {
          const Icon = mode.icon
          const isActive = index === activeIndex

          return (
            <motion.div
              key={index}
              className={`flex cursor-pointer items-center rounded-3xl text-black ${mode.color} overflow-hidden`}
              whileTap={{ scale: 0.9 }}
              animate={floatingAnimation(index)}
              onClick={() => setActiveIndex(index)}
            >
              <div className="m-2 flex">
                <Icon className="sq-6" />
                <AnimatePresence mode="wait">
                  {isActive && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: measuredWidth, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <span className="whitespace-nowrap"> {mode.text} </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )
        })}
      </div>
      <div className="text-center font-display text-white/70">GAME MODES</div>
    </div>
  )
}

export default GameModeAnimation

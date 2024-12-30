"use client"

import type { TargetAndTransition } from "framer-motion"
import React, { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import useMeasure from "react-use-measure"

import { GAME_MODE_DETAILS_LIST } from "~/lib/games/constants"

const GameModeAnimation = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [measureRef, bounds] = useMeasure()
  const [measuredWidth, setMeasuredWidth] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % GAME_MODE_DETAILS_LIST.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [activeIndex])

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
        {GAME_MODE_DETAILS_LIST[activeIndex]?.title}
      </div>

      <div className="mb-3 flex items-center gap-3">
        {GAME_MODE_DETAILS_LIST.map((mode, index) => {
          const isActive = index === activeIndex

          return (
            <motion.div
              key={index}
              className={`flex cursor-pointer items-center rounded-3xl text-black ${mode.color} overflow-hidden ${isActive ? "pr-2" : ""}`}
              whileTap={{ scale: 0.9 }}
              animate={floatingAnimation(index)}
              onClick={() => setActiveIndex(index)}
            >
              <div className="m-2 flex">
                <mode.icon className="sq-6" />
                <AnimatePresence mode="wait">
                  {isActive && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: measuredWidth, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <span className="whitespace-nowrap">&nbsp;{mode.title}</span>
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

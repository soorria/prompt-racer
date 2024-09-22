import React, { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

export function CountdownTimer({ endTime }: { endTime: number }) {
  const { minutes, seconds } = useCountdown(endTime)

  return (
    <div className="flex transform items-center tabular-nums">
      <AnimatedNumber value={minutes} />
      <span className="mx-1">:</span>
      <AnimatedNumber value={seconds} />
    </div>
  )
}

type CountdownResult = {
  minutes: number
  seconds: number
}

const ONE_MINUTE_MS = 60 * 1000

function getSplitTimeDiff({ now, endTime }: { now: number; endTime: number }) {
  if (now > endTime) {
    return { minutes: 0, seconds: 0 }
  }

  const diffMs = endTime - now

  return {
    minutes: Math.floor(diffMs / ONE_MINUTE_MS),
    seconds: Math.floor((diffMs % ONE_MINUTE_MS) / 1000),
  }
}

function useCountdown(endTime: number): CountdownResult {
  const [timeRemaining, setTimeRemaining] = useState(() =>
    getSplitTimeDiff({ now: Date.now(), endTime }),
  )

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = Date.now()

      if (endTime < currentTime) {
        setTimeRemaining({ minutes: 0, seconds: 0 })
        clearInterval(intervalId)
        return
      }

      setTimeRemaining((currentEndTime) => {
        const newEndTime = getSplitTimeDiff({ now: currentTime, endTime })

        if (
          newEndTime.minutes === currentEndTime.minutes &&
          newEndTime.seconds === currentEndTime.seconds
        ) {
          return currentEndTime
        }

        return newEndTime
      })
    }, 10)

    return () => clearInterval(intervalId)
  }, [endTime])

  return timeRemaining
}

function AnimatedNumber({ value }: { value: number }) {
  const formatted = value.toString().padStart(2, "0")
  const digits = formatted.split("")
  return digits.map((digit, i) => {
    return (
      <AnimatePresence mode="popLayout" key={i} initial={false}>
        <motion.div
          key={digit}
          initial={{
            y: "-100%",
            opacity: 0,
          }}
          transition={{
            duration: 0.3,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            y: "100%",
            opacity: [1, 0.25, 0],
          }}
          suppressHydrationWarning
          style={{ width: "1.3ex" }}
        >
          {digit}
        </motion.div>
      </AnimatePresence>
    )
  })
}

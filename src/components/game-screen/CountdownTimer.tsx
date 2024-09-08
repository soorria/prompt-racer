import React, { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

type Props = {
  endTime: number
}

export function CountdownTimer({ endTime }: Props) {
  const { minutes, seconds } = useCountdown(endTime)

  return (
    <div className="flex gap-4">
      <div className="flex transform items-center font-display text-6xl tabular-nums">
        <AnimatedNumber value={minutes} />
        <span className="mx-1">:</span>
        <AnimatedNumber value={seconds} />
      </div>
    </div>
  )
}

type CountdownResult = {
  minutes: number
  seconds: number
}

const ONE_MINUTE_MS = 60 * 1000

function getSplitTimeDiff(now: number, endTime: number) {
  const diffMs = endTime - now
  return {
    minutes: Math.floor(diffMs / ONE_MINUTE_MS),
    seconds: Math.floor((diffMs % ONE_MINUTE_MS) / 1000),
  }
}

function useCountdown(endTime: number): CountdownResult {
  const [timeRemaining, setTimeRemaining] = useState(() => getSplitTimeDiff(endTime, Date.now()))

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = Date.now()

      if (currentTime < endTime) {
        setTimeRemaining({
          minutes: 0,
          seconds: 0,
        })
        clearInterval(intervalId)
      }

      setTimeRemaining((currentEndTime) => {
        const newEndTime = getSplitTimeDiff(endTime, currentTime)

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
      <AnimatePresence mode="wait" key={i}>
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

import { cx } from "class-variance-authority"
import ms from "ms"
import React, { useState, useEffect } from "react"

type Props = {
  endTime: number
}

export default function CountdownTimer({ endTime }: Props) {
  const [timeRemaining, setTimeRemaining] = useState(endTime - Date.now())

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentTime = Date.now()

      if (currentTime < endTime) {
        setTimeRemaining(endTime - currentTime)
      } else {
        clearInterval(intervalId)
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [endTime])

  const minutes = Math.floor(timeRemaining / ms("1m"))
  const seconds = Math.floor((timeRemaining % ms("1m")) / 1000)
  const scale = 1
  return (
    <div className="flex gap-4">
      <div
        className="flex flex-col items-center transform"
        style={{ transform: `scale(${scale})` }}
      >
        <span className="countdown font-display text-6xl">
          <span
            className={cx("h-14 inline-block overflow-y-hidden", {
              "text-red-500": minutes === 0 && seconds < 10,
            })}
            style={{ "--value": minutes } as React.CSSProperties}
          ></span>
        </span>
        <p
          className={cx("text-gray-400 font-bold", {
            "text-red-500 animate-pulse": minutes === 0 && seconds < 10,
          })}
        >
          min
        </p>
      </div>
      <div
        className="flex flex-col items-center transform"
        style={{ transform: `scale(${scale})` }}
      >
        <span className="countdown font-display text-6xl">
          <span
            className={cx("h-14 inline-block overflow-y-hidden", {
              "text-red-500": minutes === 0 && seconds < 10,
            })}
            style={{ "--value": seconds } as React.CSSProperties}
          ></span>
        </span>
        <p
          className={cx("text-gray-400 font-bold", {
            "text-red-500 animate-pulse": minutes === 0 && seconds < 10,
          })}
        >
          sec
        </p>
      </div>
    </div>
  )
}

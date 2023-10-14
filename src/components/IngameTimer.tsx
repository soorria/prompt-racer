import { cx } from "class-variance-authority"
import ms from "ms"
import React, { useState, useEffect } from "react"
import useCountdown from "./useCountdown"

type Props = {
  endTime: number
}

export default function IngameTimer({ endTime }: Props) {
  const { minutes, seconds } = useCountdown(endTime)

  const scale = 0.5
  return (
    <div className="flex opacity-20 hover:opacity-50 transition-opacity">
      <div
        className="flex flex-col items-center transform -mr-2"
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
          className={cx("text-gray-400 font-bold text-2xl", {
            "text-red-500 animate-pulse": minutes === 0 && seconds < 10,
          })}
        >
          min
        </p>
      </div>
      <div
        className="flex flex-col items-center transform -ml-2"
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
          className={cx("text-gray-400 font-bold text-2xl", {
            "text-red-500 animate-pulse": minutes === 0 && seconds < 10,
          })}
        >
          sec
        </p>
      </div>
    </div>
  )
}

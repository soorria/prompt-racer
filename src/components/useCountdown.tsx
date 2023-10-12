import { useState, useEffect } from "react"
import ms from "ms"

type CountdownResult = {
  minutes: number
  seconds: number
}

function useCountdown(endTime: number): CountdownResult {
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

  return {
    minutes,
    seconds,
  }
}

export default useCountdown

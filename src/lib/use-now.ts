import { useEffect, useState } from "react"

export const useNow = () => {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    let raf: ReturnType<typeof requestAnimationFrame>
    const loop = () => {
      setNow(new Date())

      raf = requestAnimationFrame(loop)
    }

    loop()

    return () => {
      if (raf) {
        cancelAnimationFrame(raf)
      }
    }
  }, [])

  return now
}

import { useEffect, useMemo, useState } from "react"
import { screens } from "tailwindcss/defaultTheme"

export const useTwBreakpoint = (breakpoint: keyof typeof screens) => {
  const mediaQuery = useMemo(() => {
    return window.matchMedia(`(min-width: ${screens[breakpoint]})`)
  }, [breakpoint])
  const [matches, setMatches] = useState(mediaQuery.matches)

  useEffect(() => {
    const handler = () => {
      setMatches(mediaQuery.matches)
    }

    mediaQuery.addEventListener("change", handler)

    return () => {
      mediaQuery.removeEventListener("change", handler)
    }
  }, [mediaQuery])

  return matches
}

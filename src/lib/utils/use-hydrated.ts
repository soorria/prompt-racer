import { useEffect, useState } from "react"

let _hydrated = false

export function useHydrated() {
  const [hydrated, setHydrated] = useState(_hydrated)

  useEffect(() => {
    _hydrated = true
    setHydrated(true)
  }, [])

  return hydrated
}

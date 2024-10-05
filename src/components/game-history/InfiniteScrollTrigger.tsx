"use client"

import { useEffect, useRef } from "react"

import { useStableCallback } from "~/lib/utils/use-stable-callback"

type InfiniteScrollTriggerProps = {
  onInView: () => void
  children?: React.ReactNode
}

export function InfiniteScrollTrigger(props: InfiniteScrollTriggerProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  const onInView = useStableCallback(props.onInView)

  useEffect(() => {
    const element = elementRef.current

    if (!element) {
      return
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          observer.disconnect()
          onInView?.()
        }
      })
    })

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [onInView])

  return <div ref={elementRef}>{props.children}</div>
}

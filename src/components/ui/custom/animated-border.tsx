"use client"

import type { RefObject } from "react"
import React, { useLayoutEffect, useRef, useState } from "react"

import { IS_DEV } from "~/env"
import { cn } from "~/lib/utils"

type AnimatedBorderProps = {
  children: React.ReactNode
  strokeWidth?: number
  debug?: true
}

export function AnimatedBorder({ strokeWidth, children, debug }: AnimatedBorderProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const elementDetails = useElementDetails(elementRef)

  const offset = 1.5

  return (
    <div className="relative w-full" ref={elementRef}>
      {React.Children.only(children)}

      <div
        data-border-ignore
        className={cn("pointer-events-none absolute grid place-items-center", {
          "opacity-0": !elementDetails.ready,
        })}
        style={{
          left: -offset,
          top: -offset,
          width: elementDetails.width + 2 * offset,
          height: elementDetails.height + 2 * offset,
        }}
      >
        <AnimatedBorderSVG
          width={elementDetails.width + 2 * offset}
          height={elementDetails.height + 2 * offset}
          borderRadius={elementDetails.borderRadius ?? 0}
          strokeWidth={strokeWidth ?? 1}
          debug={debug}
        />
      </div>
    </div>
  )
}

interface ElementDetails {
  ready: boolean
  width: number
  height: number
  borderRadius: number
}

const defaultElementDetails: ElementDetails = {
  ready: false,
  width: 0,
  height: 0,
  borderRadius: 0,
}

function useElementDetails(elementRef: RefObject<HTMLElement>) {
  const [elementDetails, setElementDetails] = useState<ElementDetails>(defaultElementDetails)

  useLayoutEffect(() => {
    const element = elementRef.current
    if (!element) {
      return
    }

    function observeDetails() {
      if (!element) {
        return
      }

      const child = element.querySelector(":not([data-border-ignore])")

      let borderRadius = 0

      if (child) {
        const resolvedBorderRadius = window.getComputedStyle(child).borderRadius
        borderRadius = parseFloat(resolvedBorderRadius)
      }

      setElementDetails({
        ready: true,
        borderRadius: borderRadius,
        width: element.offsetWidth,
        height: element.offsetHeight,
      })
    }

    observeDetails()

    const observer = new ResizeObserver(observeDetails)
    observer.observe(element, { box: "border-box" })

    return () => {
      observer.disconnect()
    }
  }, [elementRef])

  return elementDetails
}

function AnimatedBorderSVG({
  width,
  height,
  borderRadius,
  strokeWidth,
  debug: debugProp,
}: {
  width: number
  height: number
  borderRadius: number
  strokeWidth: number
  debug?: true
}) {
  const rectWidth = width - 2 * strokeWidth
  const rectHeight = height - 2 * strokeWidth

  const viewboxPadding = 0

  const debug = IS_DEV && debugProp

  return (
    <svg
      className="block"
      style={{
        width,
        height,
      }}
      viewBox={`${-1 * viewboxPadding} ${-1 * viewboxPadding} ${width + viewboxPadding} ${height + viewboxPadding}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <radialGradient id="pulseGradient">
          <stop offset="10%" stopColor="hsl(var(--primary))"></stop>
          <stop offset="95%" stopColor="hsl(var(--primary) / 0)"></stop>
        </radialGradient>
        <mask id="v-clip" strokeWidth="2">
          <rect
            x={strokeWidth}
            y={strokeWidth}
            width={rectWidth}
            height={rectHeight}
            rx={borderRadius}
            ry={borderRadius}
            stroke="white"
            vectorEffect="non-scaling-stroke"
          ></rect>
        </mask>
      </defs>

      {debug && (
        <rect
          className={"fill-none stroke-red-500/50"}
          strokeWidth={strokeWidth}
          x={strokeWidth}
          y={strokeWidth}
          width={rectWidth}
          height={rectHeight}
          rx={borderRadius}
          ry={borderRadius}
        />
      )}

      <g mask="url(#v-clip)">
        <circle
          className="animated-border-circle"
          style={{ offsetPath: `path("M0,0 H${width} V${height} H0 Z")` }}
          cx={0}
          cy={0}
          r="70"
          fill="url('#pulseGradient')"
        />
      </g>
    </svg>
  )
}

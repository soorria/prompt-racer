import React from "react"
import { useSize } from "@radix-ui/react-use-size"

type AnimatedBorderProps = {
  children: React.ReactNode
  borderRadius?: number
  strokeWidth?: number
}

export function AnimatedBorder({ borderRadius, strokeWidth, children }: AnimatedBorderProps) {
  const [element, setElement] = React.useState<HTMLDivElement | null>(null)
  const dim = useSize(element)
  console.log(dim, element)

  return (
    <div className="relative w-fit" ref={setElement}>
      {children}
      {dim && (
        <div className="absolute -inset-2">
          <AnimatedBorderSVG
            width={dim.width}
            height={dim.height}
            borderRadius={borderRadius}
            strokeWidth={strokeWidth}
          />
        </div>
      )}
    </div>
  )
}

function AnimatedBorderSVG({
  width,
  height,
  borderRadius = 0,
  strokeWidth = 1,
}: {
  width: number
  height: number
  borderRadius?: number
  strokeWidth?: number
}) {
  const rectWidth = width - 2 * strokeWidth
  const rectHeight = height - 2 * strokeWidth
  return (
    <svg
      className="block h-full w-full"
      viewBox={`-8 -8 ${width + 8} ${height + 8}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <radialGradient id="pulseGradient">
          <stop offset="10%" stop-color="#22C55E"></stop>
          <stop offset="95%" stop-color="#22C55E00"></stop>
        </radialGradient>
        <mask id="v-clip" stroke-width="3">
          <rect
            x={strokeWidth}
            y={strokeWidth}
            width={rectWidth}
            height={rectHeight}
            rx={borderRadius}
            ry={borderRadius}
            stroke="white"
            vector-effect="non-scaling-stroke"
          ></rect>
        </mask>
      </defs>

      <rect
        className={"fill-none stroke-border"}
        strokeWidth={strokeWidth}
        x={strokeWidth}
        y={strokeWidth}
        width={rectWidth}
        height={rectHeight}
        rx={borderRadius}
        ry={borderRadius}
      />

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

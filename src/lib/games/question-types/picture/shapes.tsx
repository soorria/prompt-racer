import { type CSSProperties } from "react"

import { type NonEmptyReadonlyArray } from "~/lib/utils/types"

export interface ShapeConfig {
  render: (props: { style: CSSProperties }) => JSX.Element
}

export const SHAPE_NAME_TO_CONFIG = {
  rectangle: {
    render: (args) => {
      return <div style={args.style} />
    },
  },
  // maybe only for hard?
  // ellipse: {
  //   render: (args) => {
  //     return <div style={{ ...args.style, borderRadius: "50%" }} />
  //   },
  // },
  circle: {
    render: (args) => {
      return <div style={{ ...args.style, height: args.style.width, borderRadius: "50%" }} />
    },
  },
  square: {
    render: (args) => {
      return <div style={{ ...args.style, height: args.style.width }} />
    },
  },

  // pentagon: {
  //   render: (args) => {
  //     return (
  //       <div
  //         style={{
  //           ...args.style,
  //           height: args.style.width,
  //           clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
  //         }}
  //       />
  //     )
  //   },
  // },
} as const satisfies Record<string, ShapeConfig>

export const SHAPES = Object.values(
  SHAPE_NAME_TO_CONFIG,
) as unknown as NonEmptyReadonlyArray<ShapeConfig>

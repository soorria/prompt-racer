import type { Values } from "~/lib/utils/types"

export const positionRowClasses = {
  0: {
    row: "hover:bg-yellow-700/25",
    rankCell: "group-hover/row:text-yellow-400",
  },
  1: {
    row: "hover:bg-gray-600/25",
    rankCell: "group-hover/row:text-gray-300",
  },
  2: {
    row: "hover:bg-orange-900/25",
    rankCell: "group-hover/row:text-orange-400",
  },
  "3+": {
    row: "hover:bg-zinc-800/25",
    rankCell: "",
  },
} satisfies Record<
  PropertyKey,
  {
    row: string
    rankCell: string
  }
>

export function getPositionRowClasses(position: number): Values<typeof positionRowClasses> {
  if (position <= 2) {
    return positionRowClasses[position as keyof typeof positionRowClasses]
  }
  return positionRowClasses["3+"]
}

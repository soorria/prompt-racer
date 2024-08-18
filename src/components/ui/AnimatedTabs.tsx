"use client"

import type { Transition } from "framer-motion"
import type { ReactElement } from "react"
import { Children, cloneElement, useEffect, useId, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { cn } from "~/lib/utils"

type ChildrenType = {
  "data-id": string
  "data-checked"?: string
} & React.HTMLAttributes<HTMLElement>

type AnimatedBackgroundProps = {
  children: ReactElement<ChildrenType>[] | ReactElement<ChildrenType>
  defaultValue?: string
  onValueChange?: (newActiveId: string | null) => void
  className?: string
  transition?: Transition
  enableHover?: boolean
}

export default function AnimatedBackground({
  children,
  defaultValue,
  onValueChange,
  className,
  transition,
  enableHover = false,
}: AnimatedBackgroundProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const uniqueId = useId()

  const handleSetActiveId = (id: string | null) => {
    setActiveId(id)

    if (onValueChange) {
      onValueChange(id)
    }
  }

  useEffect(() => {
    if (defaultValue !== undefined) {
      setActiveId(defaultValue)
    }
  }, [defaultValue])

  return Children.map(children, (child, index) => {
    const id = child.props["data-id"]

    const interactionProps = enableHover
      ? {
          onMouseEnter: () => handleSetActiveId(id),
          onMouseLeave: () => handleSetActiveId(null),
        }
      : {
          onClick: () => handleSetActiveId(id),
        }

    return cloneElement(
      child,
      {
        key: index,
        className: cn("relative inline-flex"),
        "aria-selected": activeId === id,
        "data-checked": activeId === id ? "true" : "false",
        ...interactionProps,
      },
      <>
        <AnimatePresence initial={false}>
          {activeId === id && (
            <motion.div
              layoutId={`background-${uniqueId}`}
              className={cn("absolute inset-0", className)}
              transition={transition}
              initial={{ opacity: defaultValue ? 1 : 0 }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
            />
          )}
        </AnimatePresence>
        <span className="z-10">{child}</span>
      </>,
    )
  })
}

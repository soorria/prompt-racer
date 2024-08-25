"use client"

import type { Transition } from "framer-motion"
import type { ReactElement } from "react"
import { Children, cloneElement, useId } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { cn } from "~/lib/utils"

type ChildrenType = {
  "data-id": string
  "data-checked"?: string
} & React.HTMLAttributes<HTMLElement>

type AnimatedTabInteraction = "hover" | "click"
type AnimatedBackgroundProps<Interaction extends AnimatedTabInteraction> = {
  children: ReactElement<ChildrenType>[] | ReactElement<ChildrenType>
  value?: string
  onChange?: (newActiveId: Interaction extends "hover" ? string | null : string) => void
  className?: string
  transition?: Transition
  interaction: Interaction
}

export default function AnimatedTabs<Interaction extends AnimatedTabInteraction>({
  children,
  value,
  onChange,
  className,
  transition,
  interaction,
}: AnimatedBackgroundProps<Interaction>) {
  const uniqueId = useId()

  const handleSetActiveId = (id: string | null) => {
    // todo: make types not bad
    onChange?.(id!)
  }

  return Children.map(children, (child, index) => {
    const id = child.props["data-id"]

    const interactionProps =
      interaction === "hover"
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
        className: cn("relative inline-flex", child.props.className),
        "aria-selected": value === id,
        "data-checked": value === id ? "true" : "false",
        ...interactionProps,
      },
      <>
        <AnimatePresence initial={false}>
          {value === id && (
            <motion.div
              layoutId={`background-${uniqueId}`}
              className={cn("absolute inset-0", className)}
              transition={transition}
              initial={{ opacity: value ? 1 : 0 }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
            />
          )}
        </AnimatePresence>
        <span className="z-10">{child.props.children}</span>
      </>,
    )
  })
}

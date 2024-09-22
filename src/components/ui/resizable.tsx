"use client"

import { createContext, useContext } from "react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "~/lib/utils"

const OrientationContext = createContext<"vertical" | "horizontal">("horizontal")
export const useOrientation = () => useContext(OrientationContext)

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <OrientationContext.Provider value={props.direction}>
    <ResizablePrimitive.PanelGroup
      className={cn("flex h-full w-full data-[panel-group-direction=vertical]:flex-col", className)}
      {...props}
    />
  </OrientationContext.Provider>
)

const ResizablePanel = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Panel>) => (
  <ResizablePrimitive.Panel
    {...props}
    className={cn("relative max-h-full overflow-scroll rounded-xl", className)}
    style={{ overflow: "scroll" }}
  />
)

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean
}) => {
  const orientation = useOrientation()
  return (
    <ResizablePrimitive.PanelResizeHandle
      className={cn("relative flex items-center justify-center bg-none", className, {
        "w-3": orientation === "horizontal",
        "h-3": orientation === "vertical",
      })}
      {...props}
    >
      {withHandle && (
        <div
          className={cn("rounded-full bg-white/50", {
            "h-24 w-1": orientation === "horizontal",
            "h-1 w-24": orientation === "vertical",
          })}
        ></div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }

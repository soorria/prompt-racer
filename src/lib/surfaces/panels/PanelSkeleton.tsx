"use client"

import React, { Suspense } from "react"

import type { GroupPanelSchema } from "./panels"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable"
import { Skeleton } from "~/components/ui/skeleton"
import { validateUniqueKeys } from "./panels"

const PanelSkeleton = ({ layout }: { layout: GroupPanelSchema }) => {
  validateUniqueKeys(layout)

  const onLayout = (sizes: number[]) => {
    document.cookie = `react-resizable-panels:${layout.key}=${JSON.stringify(sizes)}`
  }

  return (
    <ResizablePanelGroup
      direction={layout.direction}
      autoSaveId={`${layout.key}-panel`}
      onLayout={onLayout}
    >
      {layout.panels.map((panel, index) => {
        const isLast = index === layout.panels.length - 1

        return (
          <React.Fragment key={index}>
            {panel.type === "group" ? (
              <ResizablePanel defaultSize={panel.defaultSize}>
                <PanelSkeleton layout={panel} />
              </ResizablePanel>
            ) : (
              <ResizablePanel defaultSize={panel.defaultSize} className={panel.className}>
                <Suspense fallback={<Skeleton className="h-full" />}>{panel.component}</Suspense>
              </ResizablePanel>
            )}
            {!isLast && <ResizableHandle withHandle />}
          </React.Fragment>
        )
      })}
    </ResizablePanelGroup>
  )
}

export default PanelSkeleton

"use client"

import React, { Suspense } from "react"

import type { LayoutSchema } from "./panels"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable"
import { Skeleton } from "~/components/ui/skeleton"
import { validateUniqueKeys } from "./panels"

const PanelSkeleton = ({ schema }: { schema: LayoutSchema }) => {
  validateUniqueKeys(schema)

  const onLayout = (sizes: number[]) => {
    document.cookie = `react-resizable-panels:${schema.key}=${JSON.stringify(sizes)}`
  }

  return (
    <ResizablePanelGroup
      direction={schema.direction}
      autoSaveId={`${schema.key}-panel`}
      // defaultValue={schema.defaultValue}
      onLayout={onLayout}
    >
      {schema.panels.map((panel, index) => {
        const isLast = index === schema.panels.length - 1

        return (
          <React.Fragment key={index}>
            {panel.type === "layout" ? (
              <ResizablePanel defaultSize={panel.defaultSize}>
                <PanelSkeleton schema={panel} />
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

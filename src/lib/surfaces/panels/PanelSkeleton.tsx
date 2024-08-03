import React from "react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable"
import { type LayoutSchema } from "./panels"

const PanelSkeleton = ({ schema }: { schema: LayoutSchema }) => {
  return (
    <ResizablePanelGroup direction={schema.direction}>
      {schema.panels.map((panel, index) => {
        const isLast = index === schema.panels.length - 1

        return (
          <React.Fragment key={index}>
            {"direction" in panel ? (
              <ResizablePanel className="flex-1">
                <PanelSkeleton schema={panel} />
              </ResizablePanel>
            ) : (
              <ResizablePanel className={panel.className}>
                <panel.component {...panel.props} />
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

import React from "react"

import CodeView from "~/components/game-screen/CodeView"
import QuestionDescription from "~/components/game-screen/QuestionDescription"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "~/components/ui/resizable"

/*
 *  TODO: given a schema, generate the panels and throw in the
 *  correct blocks. Then we gotta handle the responsive stuff
 *  this module should not concern itself with the contents
 *  of the panels, it should just be a container for the panels
 *  and how to display them
 */
export default function GamePage() {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel className="bg-card p-4">
        <QuestionDescription />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel className="bg-none">
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel className="bg-dracula p-4">
            <CodeView />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel className="bg-card p-4">
            been the industr standard dummy text ever since the 1500s, when an unknown printer took
            a galley of type and scrambled it to make a type specimen book. It has survived not only
            five centuries, but also the leap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of Letraset sheets
            containing Lorem Ipsum passages, and more recently with desktop publishing software like
            Aldus PageMaker including versions of Lorem Ipsum.
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

"use server"

import React from "react"

import type { LayoutSchema } from "~/lib/surfaces/panels/panels"
import CodeView from "~/components/game-screen/CodeView"
import QuestionDescription from "~/components/game-screen/QuestionDescription"
import PanelSkeleton from "~/lib/surfaces/panels/PanelSkeleton"
import { updateSchemaFromCookies } from "~/lib/surfaces/panels/persistance"

const dynamicSchema: LayoutSchema = {
  type: "layout",
  key: "main",
  direction: "horizontal",
  defaultSize: 100,
  panels: [
    {
      type: "layout",
      key: "left",
      direction: "vertical",
      defaultSize: 20,
      panels: [
        {
          type: "panel",
          key: "code",
          className: "bg-dracula p-4",
          defaultSize: 90,
          component: <CodeView />,
        },
        {
          type: "panel",
          key: "question",
          className: "bg-card p-4",
          defaultSize: 10,
          component: <QuestionDescription />,
        },
      ],
    },
    {
      type: "layout",
      key: "right",
      direction: "vertical",
      defaultSize: 80,
      panels: [
        {
          type: "panel",
          key: "question2",
          className: "bg-card p-4",
          defaultSize: 100,
          component: <QuestionDescription />,
        },
      ],
    },
  ],
}

export default async function GamePage() {
  const updatedSchema = updateSchemaFromCookies(dynamicSchema)

  if (!updatedSchema) {
    return <div>Failed to load game</div>
  }
  return <PanelSkeleton schema={updatedSchema} />
}

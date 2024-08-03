"use server"

import React from "react"
import { cookies } from "next/headers"

import type { LayoutSchema } from "~/lib/surfaces/panels/panels"
import CodeView from "~/components/game-screen/CodeView"
import QuestionDescription from "~/components/game-screen/QuestionDescription"
import { PanelItem } from "~/lib/surfaces/panels/panels"
import PanelSkeleton from "~/lib/surfaces/panels/PanelSkeleton"

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

  if (updatedSchema.type === "layout") {
    return <PanelSkeleton schema={updatedSchema} />
  }
}

function updateSchemaFromCookies(schema: PanelItem): PanelItem {
  const cookieKey = `react-resizable-panels:${schema.key}`
  const layout = cookies().get(cookieKey)
  if (schema.type === "panel") {
    return schema
  }
  if (layout && schema.type === "layout") {
    try {
      const savedLayout = JSON.parse(layout.value) as number[]
      // go through each panel and update the default size
      schema.panels = schema.panels.map((panel, index) => {
        if (panel.type === "panel") {
          panel.defaultSize = savedLayout[index]!
        } else if (panel.type === "layout") {
          panel = updateSchemaFromCookies(panel)
          panel.defaultSize = savedLayout[index]!
        }
        return panel
      })
    } catch (error) {
      console.error(`Failed to parse layout for ${layout.value}:`, error)
    }
  }
  return schema
}

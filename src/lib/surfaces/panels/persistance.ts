import { cookies } from "next/headers"
import { type GroupPanelSchema, type PanelItem } from "./panels"

export const updateLayoutSizingFromCookies = (schema: GroupPanelSchema): GroupPanelSchema | undefined => {
  const newSchema = updateSchemaFromCookiesHelper(schema)
  if (newSchema.type === "group") {
    return newSchema
  }
  return undefined
}

const updateSchemaFromCookiesHelper = (schema: PanelItem): PanelItem => {
  const cookieKey = `react-resizable-panels:${schema.key}`
  const layout = cookies().get(cookieKey)
  if (schema.type === "panel") {
    return schema
  }
  if (layout && schema.type === "group") {
    try {
      const savedLayout = JSON.parse(layout.value) as number[]
      // go through each panel and update the default size
      schema.panels = schema.panels.map((panel, index) => {
        if (panel.type === "panel") {
          panel.defaultSize = savedLayout[index]!
        } else if (panel.type === "group") {
          panel = updateSchemaFromCookiesHelper(panel)
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

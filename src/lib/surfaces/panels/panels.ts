export type PanelSchema = {
  className: string
  component: React.ComponentType<unknown>
  props?: Record<string, unknown>
}

export type LayoutSchema = {
  direction: "horizontal" | "vertical"
  panels: Array<PanelSchema | LayoutSchema>
}

export type GamePageProps = {
  schema: LayoutSchema
}

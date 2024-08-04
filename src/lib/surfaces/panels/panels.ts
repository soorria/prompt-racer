
export type PanelSchema = {
  type: "panel"
  key: string
  defaultSize: number
  className: string
  component: React.ReactElement
}

export type LayoutSchema = {
  type: "layout"
  key: string
  defaultSize: number
  direction: "horizontal" | "vertical"
  panels: PanelItem[]
}

export type PanelItem = PanelSchema | LayoutSchema;

export type GamePageProps = {
  schema: LayoutSchema
}


export const validateUniqueKeys = (schema: LayoutSchema) => {
  const keySet = new Set<string>();

  const validateKeysRecursive = (layout: LayoutSchema, alreadyVisited = true) => {
    if (!alreadyVisited) {
      if (keySet.has(layout.key)) {
        throw new Error(`Duplicate key found: ${layout.key}`);
      }
      keySet.add(layout.key);
    }
    layout.panels.forEach((panel) => {
      if (keySet.has(panel.key)) {
        throw new Error(`Duplicate key found: ${panel.key}`);
      }
      keySet.add(panel.key);

      if ('panels' in panel) {
        validateKeysRecursive(panel, true);
      }
    });
  }

  validateKeysRecursive(schema);
}
export type PanelSlot = {
  key: string
  className: string
  component: React.ReactElement
}

export type PanelSchema = {
  type: "panel"
  key: string
  defaultSize: number
  className: string
  component: React.ReactElement
}

export type GroupPanelSchema = {
  type: "group"
  key: string
  defaultSize: number
  direction: "horizontal" | "vertical"
  panels: PanelItem[]
}

export type PanelItem = PanelSchema | GroupPanelSchema;

export type GamePageProps = {
  schema: GroupPanelSchema
}

export const validateUniqueKeys = (schema: GroupPanelSchema) => {
  const keySet = new Set<string>();

  const validateKeysRecursive = (layout: GroupPanelSchema, alreadyVisited = true) => {
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

      if (panel.type === "group") {
        validateKeysRecursive(panel, true);
      }
    });
  }

  validateKeysRecursive(schema);
}
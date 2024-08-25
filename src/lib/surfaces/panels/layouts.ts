import type { GroupPanelSchema, PanelSlot } from "./panels";

export const createDefaultLayout = ({ leftSection, rightSection }: { leftSection: PanelSlot, rightSection: { top: PanelSlot, bottom: PanelSlot } }): GroupPanelSchema => {
  const schema: GroupPanelSchema = {
    type: "group",
    key: "main",
    direction: "horizontal",
    defaultSize: 100,
    panels: [
      {
        type: "group",
        key: "left",
        direction: "vertical",
        defaultSize: 45,
        panels: [
          {
            type: "panel",
            defaultSize: 100,
            ...leftSection
          },
        ],
      },
      {
        type: "group",
        key: "right",
        direction: "vertical",
        defaultSize: 55,
        panels: [
          {
            type: "panel",
            defaultSize: 70,
            ...rightSection.top
          },
          {
            type: "panel",
            defaultSize: 30,
            ...rightSection.bottom
          },
        ],
      },

    ],
  }
  return schema
}

export const createDefaultMobileLayout = ({ top, bottom }: { top: PanelSlot, bottom: PanelSlot }): GroupPanelSchema => {
  const schema: GroupPanelSchema = {
    type: "group",
    key: "main",
    direction: "vertical",
    defaultSize: 100,
    panels: [
      {
        type: "panel",
        defaultSize: 30,
        ...top
      },
      {
        type: "panel",
        defaultSize: 70,
        ...bottom
      },
    ],
  }
  return schema
}
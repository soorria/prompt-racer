import type { GroupPanelSchema, PanelSlot } from "./panels";

export const createDefaultLayout = ({ leftSection, rightSection }: { leftSection: { top: PanelSlot, bottom: PanelSlot }, rightSection: PanelSlot }): GroupPanelSchema => {
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
        defaultSize: 20,
        panels: [
          {
            type: "panel",
            defaultSize: 90,
            ...leftSection.top
          },
          {
            type: "panel",
            defaultSize: 10,
            ...leftSection.bottom
          },
        ],
      },
      {
        type: "group",
        key: "right",
        direction: "vertical",
        defaultSize: 80,
        panels: [
          {
            type: "panel",
            defaultSize: 100,
            ...rightSection
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
    key: "asdf",
    direction: "vertical",
    defaultSize: 100,
    panels: [
      {
        type: "panel",
        defaultSize: 70,
        ...top
      },
      {
        type: "panel",
        defaultSize: 30,
        ...bottom
      },
    ],
  }
  return schema
}
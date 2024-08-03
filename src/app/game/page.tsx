import React from "react"

import CodeView from "~/components/game-screen/CodeView"
import QuestionDescription from "~/components/game-screen/QuestionDescription"
import { type LayoutSchema } from "~/lib/surfaces/panels/panels"
import PanelSkeleton from "~/lib/surfaces/panels/PanelSkeleton"

const dynamicSchema: LayoutSchema = {
  direction: "horizontal",
  panels: [
    {
      direction: "vertical",
      panels: [
        {
          className: "bg-dracula p-4",
          component: CodeView,
        },
        {
          className: "bg-card p-4",
          component: QuestionDescription,
          props: {
            question: "Describe the approach you would take to solve this problem.",
          },
        },
      ],
    },
    {
      direction: "vertical",
      panels: [
        {
          className: "bg-card p-4",
          component: QuestionDescription,
          props: {
            question: "Describe the approach you would take to solve this problem.",
          },
        },
      ],
    },
  ],
}

/*
 *  TODO: given a schema, generate the panels and throw in the
 *  correct blocks. Then we gotta handle the responsive stuff
 *  this module should not concern itself with the contents
 *  of the panels, it should just be a container for the panels
 *  and how to display them
 */
export default function GamePage() {
  return <PanelSkeleton schema={dynamicSchema} />
}

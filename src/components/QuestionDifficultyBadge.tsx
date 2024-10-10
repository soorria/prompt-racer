import React from "react"

import { type Doc } from "~/lib/db/types"
import { MapfromDifficultyToBadgeVariant } from "~/lib/games/types"
import { cn } from "~/lib/utils"
import { Badge } from "./ui/badge"

export default function QuestionDifficultyBadge({
  difficulty,
  className,
}: {
  difficulty: Doc<"questions">["difficulty"]
  className?: string
}) {
  return (
    <Badge variant={MapfromDifficultyToBadgeVariant[difficulty]} className={cn(className, "w-fit")}>
      {`${difficulty[0]!.toLocaleUpperCase()}${difficulty.slice(1)} Question`}
    </Badge>
  )
}

import Image from "next/image"
import Markdown from "react-markdown"

import type { PictureQuestion } from "~/lib/games/types"
import { useGameManager } from "~/components/game-screen/GameManagerProvider"
import { Badge } from "~/components/ui/badge"
import { WinConditionCard } from "~/components/WinConditionCard"
import { GAME_MODE_DETAILS } from "~/lib/games/constants"
import { PICTURE_QUESTION_DIFFICULTY_CONFIGS } from "~/lib/games/question-types/picture/constants"
import { DifficultyToBadgeVariantMap } from "~/lib/games/types"

export function PictureQuestionDescription({ question }: { question: PictureQuestion }) {
  const { gameInfo } = useGameManager()

  return (
    <div>
      <div className="mb-1 text-2xl font-bold">Picture Question</div>
      <Badge variant={DifficultyToBadgeVariantMap[question.difficulty]} className="mb-2">
        {question.difficulty}
      </Badge>
      <WinConditionCard mode={GAME_MODE_DETAILS[gameInfo.mode]} />
      <div className="text-pretty text-sm">
        <Markdown className="prose prose-invert">{question.pictureQuestion.description}</Markdown>
      </div>

      <div className="mt-8">
        <h3 className="mb-2 font-medium">Solution Image</h3>
        <Image
          src={question.pictureQuestion.solution_image_url}
          width={PICTURE_QUESTION_DIFFICULTY_CONFIGS[question.difficulty].size}
          height={PICTURE_QUESTION_DIFFICULTY_CONFIGS[question.difficulty].size}
          alt="Solution"
          className="max-w-full rounded-md"
        />
      </div>
    </div>
  )
}

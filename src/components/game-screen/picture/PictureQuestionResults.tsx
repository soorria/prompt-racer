import { Skeleton } from "~/components/ui/skeleton"
import { PICTURE_QUESTION_DIFFICULTY_CONFIGS } from "~/lib/games/question-types/picture/constants"
import { useGameManager } from "../GameManagerProvider"

const HTMLPreview = ({ html, size }: { html: string; size: number }) => {
  return (
    <iframe
      key={html}
      srcDoc={html}
      style={{
        width: size,
        height: size,
      }}
      className="rounded-lg border border-border bg-white"
      title="HTML Preview"
      sandbox="allow-scripts"
    />
  )
}

export function PictureQuestionResults() {
  const { gameSessionInfo, isGeneratingCode } = useGameManager()
  const { size } = PICTURE_QUESTION_DIFFICULTY_CONFIGS[gameSessionInfo.game.question.difficulty]

  return (
    <div className="relative flex flex-col">
      <div className="flex-1">
        {gameSessionInfo.code ? (
          <>
            {!isGeneratingCode ? (
              <HTMLPreview html={gameSessionInfo.code} size={size} />
            ) : (
              <Skeleton style={{ width: size, height: size }} />
            )}
          </>
        ) : (
          <div className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
            No preview available yet. Submit your code to see the result.
          </div>
        )}
      </div>
    </div>
  )
}

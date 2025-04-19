import DOMPurify from "isomorphic-dompurify"

import { Skeleton } from "~/components/ui/skeleton"
import { PICTURE_QUESTION_DIFFICULTY_CONFIGS } from "~/lib/games/question-types/picture/constants"
import { useGameManager } from "../GameManagerProvider"

const HTMLPreview = ({ html, size }: { html: string; size: number }) => {
  const sanitizedHtml = DOMPurify.sanitize(html, {
    FORBID_TAGS: [
      "script",
      "iframe",
      "frame",
      "object",
      "embed",
      "img",
      "video",
      "audio",
      "source",
      "picture",
      "track",
    ],
    FORBID_ATTR: [
      "onerror",
      "onload",
      "onclick",
      "onmouseover",
      "onmouseout",
      "href",
      "src",
      "srcset",
      "data-src",
    ],
    FORCE_BODY: true,
  })

  return (
    <iframe
      key={sanitizedHtml}
      srcDoc={sanitizedHtml}
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

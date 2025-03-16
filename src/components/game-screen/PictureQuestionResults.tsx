import type { PictureQuestion, QuestionTestState } from "~/lib/games/types"

export function PictureQuestionResults(props: {
  question: PictureQuestion
  testState: QuestionTestState | null
}) {
  return (
    <div>
      Picture question results coming soon!
      <br />
      {props.question.pictureQuestion.id}
      <br />
      Match percentage: {props.testState?.pictureResult.match_percentage}
    </div>
  )
}

import type { PictureQuestion } from "~/lib/games/types"

export function PictureQuestionResults(props: { question: PictureQuestion }) {
  return (
    <div>
      Picture question results coming soon!
      <br />
      {props.question.pictureQuestion.id}
      <br />
    </div>
  )
}

import { type QuestionDifficultyLevel } from "../../constants"

export const PICTURE_QUESTION_DIFFICULTY_CONFIGS: Record<
  QuestionDifficultyLevel,
  {
    size: number
    numShapes: number
  }
> = {
  easy: {
    size: 256,
    numShapes: 2,
  },
  medium: {
    size: 512,
    numShapes: 4,
  },
  hard: {
    size: 1024,
    numShapes: 16,
  },
}

export const PICTURE_QUESTION_STARTER_CODE = `
<style>
  /* Add your styles here */
</style>

<!-- Add your html -->
<div></div>
`

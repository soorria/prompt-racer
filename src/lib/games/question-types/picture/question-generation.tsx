import "server-only"

import crypto from "crypto"
import { type CSSProperties } from "react"
import { invariant } from "@epic-web/invariant"

import type { DocInsert } from "~/lib/db/types"
import { DRACULA_COLORS } from "~/lib/colors/constants"
import { createAdminSupabaseClient } from "~/lib/supabase/server"
import { repeat, unique } from "~/lib/utils/arrays"
import { createRandomWithoutRepeats, randomElement } from "~/lib/utils/random"
import { type QuestionDifficultyLevel } from "../../constants"
import { PICTURE_QUESTION_DIFFICULTY_CONFIGS, PICTURE_QUESTION_STARTER_CODE } from "./constants"
import { renderHtmlToImage, wrapUserHtmlForImage } from "./render-image"
import { SHAPES } from "./shapes"

export async function generatePictureQuestion(args: {
  difficulty: QuestionDifficultyLevel
}): Promise<DocInsert<"pictureQuestions">> {
  const getRandomColor = createRandomWithoutRepeats(DRACULA_COLORS)

  const difficultyConfig = PICTURE_QUESTION_DIFFICULTY_CONFIGS[args.difficulty]

  const backgroundColor = getRandomColor()

  const shapes = repeat(difficultyConfig.numShapes, () => {
    const color = getRandomColor()

    const jsx = (
      <RandomShape canvasSize={difficultyConfig.size} color={color} key={crypto.randomUUID()} />
    )

    return {
      jsx,
      color,
    }
  })

  const jsx = (
    <div style={{ backgroundColor, width: difficultyConfig.size, height: difficultyConfig.size }}>
      {shapes.map(({ jsx }) => jsx)}
    </div>
  )

  const html = await convertJSXToRenderableHtml(jsx)

  const imageBlob = await renderHtmlToImage({
    html,
    size: difficultyConfig.size,
  })

  const { publicUrl } = await uploadImage(imageBlob)

  return {
    description: `Colours in the images:

${unique([backgroundColor, ...shapes.map(({ color }) => color)])
  .map((color) => `- ${color}`)
  .join("\n")}    `,
    starterCode: PICTURE_QUESTION_STARTER_CODE,
    solution_image_url: publicUrl,
  }
}

async function uploadImage(blob: Blob) {
  invariant(blob.type === "image/png", "Blob must be a PNG")

  const sb = createAdminSupabaseClient()

  const fileName = `${crypto.randomUUID()}.png`

  const { data, error } = await sb.storage.from("picture-question-images").upload(fileName, blob, {
    // cache for 1 year
    cacheControl: "31556952",
    contentType: "image/png",
    upsert: true,
  })

  if (error) {
    throw new Error(error.message, { cause: error })
  }

  const {
    data: { publicUrl },
  } = sb.storage.from("picture-question-images").getPublicUrl(data.path)

  return { publicUrl }
}

function RandomShape(props: { canvasSize: number; color: string }) {
  const shape = randomElement(SHAPES)

  const sizeFrom = Math.round(props.canvasSize / 5)
  const sizeTo = Math.round(props.canvasSize / 2)
  const width = crypto.randomInt(sizeFrom, sizeTo)
  const height = crypto.randomInt(sizeFrom, sizeTo)

  const positionFrom = Math.round(props.canvasSize / 10)
  const positionTo = props.canvasSize - positionFrom

  const position = {
    x: crypto.randomInt(positionFrom, positionTo) - width / 2,
    y: crypto.randomInt(positionFrom, positionTo) - height / 2,
  }

  const style: CSSProperties = {
    backgroundColor: props.color,
    position: "fixed",
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${width}px`,
    height: `${height}px`,
  }

  return shape.render({ style })
}

async function convertJSXToRenderableHtml(jsx: React.ReactNode) {
  /**
   * need to do import expression
   * https://github.com/vercel/next.js/issues/42494
   */
  const { renderToStaticMarkup } = await import("react-dom/server")
  const html = renderToStaticMarkup(jsx)
  return wrapUserHtmlForImage(html)
}

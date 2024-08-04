import { env } from "~/env"
import { logger } from "../server/logger"

const MODAL_APP_URL = env.MODAL_PYTHON_APP_URL

export type PythonCodeRunResult =
  | {
      status: "success"
      result: unknown
      time: number
    }
  | {
      status: "error"
      reason: {
        name: string
        message: string
      }
      time: number
    }

export async function runPythonCodeAgainstTestCases(code: string, argsList: unknown[][]) {
  const response = await fetch(MODAL_APP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code: code,
      args_list: argsList,
    }),
  })

  if (!response.ok) {
    logger.debug(await response.text())
    throw new Error(`Failed to run code`)
  }

  const body = (await response.json()) as {
    results: PythonCodeRunResult[]
  }

  return body.results
}

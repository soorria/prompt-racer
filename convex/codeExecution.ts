import { v, convexToJson } from "convex/values"
import { internalAction } from "./_generated/server"
import { CodeRunResult } from "./utils/schema"

export const runPythonCode = internalAction({
  args: {
    code: v.string(),
    args_list: v.array(v.array(v.any())),
  },
  handler: async (ctx, args) => {
    const MODAL_URL = process.env.MODAL_PYTHON_URL!

    const response = await fetch(MODAL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: args.code,
        args_list: args.args_list,
      }),
    })

    if (!response.ok) {
      console.log(await response.text())
      throw new Error(`Failed to run code`)
    }

    const body = (await response.json()) as {
      results: CodeRunResult[]
    }

    return body.results
  },
})

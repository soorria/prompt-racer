import { ActionCtx, MutationCtx, QueryCtx } from "../_generated/server"

export class ConvexError extends Error {
  public cause?: Error

  constructor(
    public code: Uppercase<string>,
    public message: string,
    { cause }: { cause?: Error } = {}
  ) {
    super(`${code}: ${message}`)
    this.cause = cause
    this.name = "ConvexError"
  }

  toJSON(): ConvexErrorJSON {
    return {
      code: this.code,
      message: this.message,
      cause: this.cause
        ? {
            name: this.cause.name,
            message: this.cause.message,
            stack: this.cause.stack,
          }
        : null,
    }
  }
}
export type ConvexErrorJSON = {
  code: string
  message: string
  cause?: { name: string; message: string; stack?: string } | null
}

type AnyCtx = QueryCtx | MutationCtx | ActionCtx

export function typedHandler<
  TCtx extends AnyCtx,
  Args extends [any] | [],
  Output extends Promise<any>
>(
  handler: (ctx: TCtx, ...args: Args) => Output
): (ctx: TCtx, ...args: Args) => Promise<ConvexResult<Awaited<Output>>> {
  // type Args = Parameters<THandler>
  // type Output = Awaited<ReturnType<THandler>>

  return async (ctx: AnyCtx, ...args: Args): Promise<ConvexResult<Awaited<Output>>> => {
    try {
      const data = await handler(ctx as TCtx, ...args)
      return { success: true, data }
    } catch (e) {
      if (e instanceof ConvexError) {
        return { success: false, error: e.toJSON() }
      } else {
        return { success: false, error: new ConvexError("INTERNAL_ERROR", "Internal API error") }
      }
    }
  }
}
export const t = typedHandler

export type ConvexResult<TData> =
  | { success: true; data: TData; error?: never }
  | { success: false; data?: never; error: ConvexErrorJSON }

import {
  RequestForQueries,
  useQueries,
  useMutation as useConvexMutation,
  useAction as useConvexAction,
} from "convex/react"
import type { FunctionReference } from "convex/server"
import { useMemo, useState } from "react"

export type ExtractConvexArgs<ConvexQuery> = ConvexQuery extends FunctionReference<
  any,
  any,
  infer Args,
  any
>
  ? Args extends Record<string, never>
    ? undefined
    : Args
  : never
type ExtractConvexOutput<ConvexQuery> = ConvexQuery extends FunctionReference<
  any,
  any,
  any,
  infer Output
>
  ? Output
  : never

type OptionalArgs<Args> = Args extends Record<string, never> ? [args?: Args] : [args: Args]
type OptionalArgsOrSkip<Args> = [args: "skip"] | OptionalArgs<Args>

type WrappedUseQueryResult<Data> =
  | {
      status: "loading"
      data?: undefined
      error?: undefined
      isLoading: true
      isSuccess: false
      isError: false
    }
  | {
      status: "success"
      data?: Data
      error?: undefined
      isLoading: false
      isSuccess: true
      isError: false
    }
  | {
      status: "error"
      data?: undefined
      error?: Error
      isLoading: false
      isSuccess: false
      isError: true
    }

type WrappedUseMutationResultState<Data> =
  | WrappedUseQueryResult<Data>
  | {
      status: "idle"
      data?: undefined
      error?: undefined
      isLoading: false
      isSuccess: false
      isError: false
    }

type WrappedUseMutationResultActions<Args, Data> = {
  mutate: (...args: OptionalArgs<Args>) => void
  mutateAsync: (...args: OptionalArgs<Args>) => Promise<Data>
}
type WrappedUseMutationResult<Args, Data> =
  | WrappedUseMutationResultState<Data> & WrappedUseMutationResultActions<Args, Data>

type ResultStateBooleans = {
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
}

const commonQueryMutationResultByStatus = {
  error: {
    isLoading: false,
    isSuccess: false,
    isError: true,
  },
  loading: {
    isLoading: true,
    isSuccess: false,
    isError: false,
  },
  success: {
    isLoading: false,
    isSuccess: true,
    isError: false,
  },
  idle: {
    isLoading: false,
    isSuccess: false,
    isError: false,
  },
} satisfies Record<
  (WrappedUseMutationResult<any, any> | WrappedUseQueryResult<any>)["status"],
  ResultStateBooleans
>

export const useWrappedQuery = <
  ConvexQuery extends FunctionReference<"query", "public", any, any>,
  ConvexQueryArgs = ExtractConvexArgs<ConvexQuery>,
  ConvexQueryOutput = ExtractConvexOutput<ConvexQuery>
>(
  query: ConvexQuery,
  ...args: OptionalArgsOrSkip<ConvexQueryArgs>
): WrappedUseQueryResult<ConvexQueryOutput> => {
  const queryName = getFunctionName(query)

  const stableQueries = useMemo(() => {
    return args[0] === "skip"
      ? ({} as RequestForQueries)
      : {
          query: {
            query,
            args: args[0] as Record<string, any>,
          },
        }
    // just copying convex :). this prevents infinite re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryName, JSON.stringify(args[0])])

  const queries = useQueries(stableQueries)

  const queryResult = queries.query

  let result: Omit<WrappedUseQueryResult<ConvexQueryOutput>, keyof ResultStateBooleans>

  if (queryResult instanceof Error) {
    result = {
      status: "error",
      error: queryResult,
    }
  }
  if (typeof queryResult === "undefined") {
    result = {
      status: "loading",
    }
  } else {
    result = {
      status: "success",
      data: queryResult,
    }
  }

  Object.assign(result, commonQueryMutationResultByStatus[result.status])

  return result as WrappedUseQueryResult<ConvexQueryOutput>
}

const createSafeMutationHook = <Type extends "mutation" | "action">(type: Type) => {
  const useConvexMutationFn =
    type === "mutation" ? useConvexMutation : type === "action" ? useConvexAction : null

  if (!useConvexMutationFn) {
    throw new Error(`Invalid type ${type}`)
  }

  function useActionOrMutationInternal<
    ConvexMutation extends FunctionReference<Type, "public", any, any>,
    ConvexMutationArgs = ExtractConvexArgs<ConvexMutation>,
    ConvexMutationOutput = ExtractConvexOutput<ConvexMutation>
  >(mutation: ConvexMutation): WrappedUseMutationResult<ConvexMutationArgs, ConvexMutationOutput> {
    type UseConvexMutation = (
      mutation: ConvexMutation
    ) => (...args: OptionalArgs<ConvexMutationArgs>) => Promise<any>
    const run = (useConvexMutationFn as UseConvexMutation)(mutation)

    const [state, setState] = useState<
      Omit<WrappedUseMutationResultState<ConvexMutationOutput>, keyof ResultStateBooleans>
    >({
      status: "idle",
    })

    const mutateAsync = async (
      ...args: OptionalArgs<ConvexMutationArgs>
    ): Promise<ConvexMutationOutput> => {
      try {
        setState({
          status: "loading",
        })

        const data = await run(...args)

        setState({
          status: "success",
          data,
        })

        return data
      } catch (error) {
        setState({
          status: "error",
          error: error as Error,
        })

        throw error
      }
    }
    const mutate = (...args: OptionalArgs<ConvexMutationArgs>) => {
      mutateAsync(...args)
    }

    return {
      ...state,
      ...commonQueryMutationResultByStatus[state.status],
      mutateAsync,
      mutate,
    } as WrappedUseMutationResult<ConvexMutationArgs, ConvexMutationOutput>
  }

  return useActionOrMutationInternal
}

export const useWrappedMutation = createSafeMutationHook("mutation")
export const useWrappedAction = createSafeMutationHook("action")

/**
 * These are copied from convex/server.ts
 */
const functionNameSymbol = Symbol.for("functionName")
const getFunctionName = (fn: FunctionReference<any, any, any, any>) =>
  (fn as unknown as { [functionNameSymbol]: string })[functionNameSymbol]

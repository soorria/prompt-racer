import { useCallback, useEffect, useRef } from "react"

import { type Unsafe_AnyFunction } from "./types"

export function useStableCallback<T extends Unsafe_AnyFunction>(callback: T): T
export function useStableCallback<T extends Unsafe_AnyFunction>(
  callback?: T | undefined,
): (...args: Parameters<T>) => ReturnType<T> | undefined
export function useStableCallback<T extends Unsafe_AnyFunction>(callback?: T) {
  type Args = Parameters<T>
  type Result = ReturnType<T> | undefined

  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  })

  return useCallback((...args: Args): Result => {
    return callbackRef.current?.(...args) as Result
  }, [])
}

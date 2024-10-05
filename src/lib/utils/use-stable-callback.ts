import { useCallback, useEffect, useRef } from "react"

export function useStableCallback<T extends (...args: unknown[]) => unknown>(callback: T): T
export function useStableCallback<T extends (...args: unknown[]) => unknown>(
  callback?: T | undefined,
): (...args: Parameters<T>) => ReturnType<T> | undefined
export function useStableCallback<T extends (...args: unknown[]) => unknown>(callback?: T) {
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

export type Nullable<T> = T | null | undefined

export type Values<T> = T[keyof T]

// This is required due to ✨ contravariance ✨ :)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Unsafe_AnyFunctionParameters = any[]
export type Unsafe_AnyFunction = (...args: Unsafe_AnyFunctionParameters) => unknown

export type MaybeArray<T> = T | T[]

export type NonEmptyArray<T> = [T, ...T[]]
export type NonEmptyReadonlyArray<T> = readonly [T, ...T[]]

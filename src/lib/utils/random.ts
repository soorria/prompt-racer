import { type NonEmptyReadonlyArray } from "./types"

export function randomElement<T>(arr: readonly [T, ...T[]]): T
export function randomElement<T>(arr: readonly T[]): T | undefined
export function randomElement<T>(arr: readonly T[]): T | undefined {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function createRandomWithoutRepeats<T>(
  arr: NonEmptyReadonlyArray<T>,
  numNonRepeats = arr.length - 1,
): () => T {
  if (numNonRepeats >= arr.length) {
    throw new Error("numNonRepeats is greater than or equal to the length of the array")
  }

  let seen: T[] = []

  return () => {
    let next: T
    do {
      next = randomElement(arr)
    } while (seen.includes(next))

    seen = [...seen, next].slice(-numNonRepeats)

    return next
  }
}

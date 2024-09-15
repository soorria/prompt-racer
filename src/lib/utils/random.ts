export function randomElement<T>(arr: readonly [T, ...T[]]): T
export function randomElement<T>(arr: readonly T[]): T | undefined
export function randomElement<T>(arr: readonly T[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

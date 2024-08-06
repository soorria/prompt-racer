export function randomElement<T>(arr: [T, ...T[]]): T
export function randomElement<T>(arr: T[]): T | undefined
export function randomElement<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function repeat<T>(times: number, fn: (index: number) => T): T[] {
  return Array.from({ length: times }, (_, index) => fn(index))
}

export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)]
}

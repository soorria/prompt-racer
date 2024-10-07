export function objectMap<T extends Record<string, unknown>, U>(
  obj: T,
  fn: (value: T[keyof T], key: keyof T) => U,
): Record<keyof T, U> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, fn(value as T[keyof T], key)]),
  ) as Record<keyof T, U>
}

type Entries<T extends Record<string, unknown>> = Array<
  {
    [K in keyof T]: [K, T[K]]
  }[keyof T]
>
export function entries<T extends Record<string, unknown>>(obj: T): Entries<T> {
  return Object.entries(obj) as Entries<T>
}

declare module "react" {
  // i want interface bc they merge
  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  interface CSSProperties {
    [property: `--${string}`]: string | number
  }
}

export {}

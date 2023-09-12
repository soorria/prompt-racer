export const Debug = (props: Record<string, any>) => {
  if (process.env.NODE_ENV !== "development") return null

  return (
    <>
      <details open>
        <summary>Debug information</summary>
        <pre className="w-full overflow-x-auto">{JSON.stringify(props, null, 2)}</pre>
      </details>
    </>
  )
}

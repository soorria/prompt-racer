export const Debug = ({ $title, ...props }: { $title?: string; [k: string]: any }) => {
  if (process.env.NODE_ENV !== "development") return null

  return (
    <>
      <details open>
        <summary>{$title || "Debug information"}</summary>
        <pre className="w-full overflow-x-auto">{JSON.stringify(props, null, 2)}</pre>
      </details>
    </>
  )
}

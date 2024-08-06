import { env } from "~/env"

export default function TmpLayout(props: { children: React.ReactNode }) {
  if (env.NODE_ENV !== "development") return null

  return <div>{props.children}</div>
}

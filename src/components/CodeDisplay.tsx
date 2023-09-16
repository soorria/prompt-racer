import { refractor } from "refractor"
import python from "refractor/lang/python"
import { toJsxRuntime } from "hast-util-to-jsx-runtime"
import { Fragment, useMemo } from "react"
// @ts-expect-error asldkfjas
import { jsx, jsxs } from "react/jsx-runtime"
import "~/styles/dracula-prism.css"

refractor.register(python)

type CodeDisplayProps = {
  code: string
  language: "python"
}

const CodeDisplay = (props: CodeDisplayProps) => {
  const rendered = useMemo(() => {
    const hast = refractor.highlight(props.code, props.language)
    // @ts-expect-error no clue
    return toJsxRuntime(hast, { Fragment, jsx, jsxs })
  }, [props.code, props.language])

  return <div>{rendered}</div>
}

export default CodeDisplay

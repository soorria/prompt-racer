import { refractor } from "refractor"
import python from "refractor/lang/python"
import { toJsxRuntime } from "hast-util-to-jsx-runtime"
import { ComponentProps, Fragment, useMemo } from "react"
// @ts-expect-error asldkfjas
import { jsx, jsxs } from "react/jsx-runtime"
import "~/styles/dracula-prism.css"
import { twMerge } from "tailwind-merge"

refractor.register(python)

type CodeDisplayProps = {
  code: string
  language: "python"
  preProps?: ComponentProps<"pre">
  codeProps?: ComponentProps<"code">
}

const CodeDisplayContent = (props: Pick<CodeDisplayProps, "code" | "language">) => {
  const rendered = useMemo(() => {
    const hast = refractor.highlight(props.code, props.language)
    // @ts-expect-error no clue
    return toJsxRuntime(hast, { Fragment, jsx, jsxs })
  }, [props.code, props.language])

  return <>{rendered}</>
}

const CodeDisplay = ({ preProps, codeProps, ...rest }: CodeDisplayProps) => {
  return (
    <pre {...preProps} className={twMerge("py-2", preProps?.className)}>
      <code
        {...codeProps}
        className={twMerge("px-3 block w-max", codeProps?.className)}
        ref={codeProps?.ref}
      >
        <CodeDisplayContent {...rest} />
      </code>
    </pre>
  )
}

export default CodeDisplay

import { refractor, type Syntax } from "refractor"
import python from "refractor/lang/python"
import { type Jsx, toJsxRuntime } from "hast-util-to-jsx-runtime"
import { type ComponentProps, Fragment, useMemo } from "react"
import { jsx, jsxs } from "react/jsx-runtime"
import "~/styles/dracula-prism.css"
import { twMerge } from "tailwind-merge"
import { type Nodes } from "node_modules/hast-util-to-jsx-runtime/lib"

// Register the language
refractor.register(python as Syntax)

type CodeDisplayProps = {
  code: string
  language: "python"
  preProps?: ComponentProps<"pre">
  codeProps?: ComponentProps<"code">
}

const CodeDisplayContent = ({ code, language }: Pick<CodeDisplayProps, "code" | "language">) => {
  const rendered = useMemo(() => {
    const hast = refractor.highlight(code, language) as Nodes
    return toJsxRuntime(hast, { Fragment, jsx: jsx as Jsx, jsxs: jsxs as Jsx })
  }, [code, language])

  return <>{rendered}</>
}

const CodeDisplay = ({ preProps, codeProps, ...rest }: CodeDisplayProps) => {
  return (
    <pre {...preProps} className={twMerge("py-2", preProps?.className)}>
      <code
        {...codeProps}
        className={twMerge("block w-max px-3", codeProps?.className)}
        ref={codeProps?.ref}
      >
        <CodeDisplayContent {...rest} />
      </code>
    </pre>
  )
}

export default CodeDisplay

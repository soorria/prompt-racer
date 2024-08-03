import type { Jsx } from "hast-util-to-jsx-runtime"
import type { ComponentProps } from "react"
import type { Syntax } from "refractor"
import { Fragment, useMemo } from "react"
import { jsx, jsxs } from "react/jsx-runtime"
import { toJsxRuntime } from "hast-util-to-jsx-runtime"
import { refractor } from "refractor"
import python from "refractor/lang/python"

import "~/styles/dracula-prism.css"

import { type Nodes } from "node_modules/hast-util-to-jsx-runtime/lib"

import { cn } from "~/lib/utils"

// Register the language
refractor.register(python as Syntax)

type CodeDisplayProps = {
  code: string
  language: "python"
  showLineNumbers?: boolean
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

const CodeDisplay = ({ preProps, codeProps, showLineNumbers, ...rest }: CodeDisplayProps) => {
  const { code } = rest
  const lines = code.split("\n")

  return (
    <pre
      {...preProps}
      className={cn("relative py-2", { "pl-10": showLineNumbers }, preProps?.className)}
    >
      {showLineNumbers && (
        <div className="absolute left-0 top-0 w-10 select-none pr-3 pt-2 text-right text-gray-500">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
      )}
      <code
        {...codeProps}
        className={cn("block w-max px-3", codeProps?.className)}
        ref={codeProps?.ref}
      >
        <CodeDisplayContent {...rest} />
      </code>
    </pre>
  )
}

export default CodeDisplay

"use client"

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
  isGeneratingCode?: boolean
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

const CodeRenderer = ({
  preProps,
  codeProps,
  showLineNumbers,
  isGeneratingCode,
  ...rest
}: CodeDisplayProps) => {
  const lines = rest.code.split("\n")

  return (
    <pre
      {...preProps}
      className={cn("relative flex py-2", { "pl-4": showLineNumbers }, preProps?.className)}
    >
      {showLineNumbers && (
        <div className="sticky left-0 top-0 -ml-4 -translate-x-4 select-none bg-dracula/80 pl-8 pr-4 pt-0 text-right text-gray-500 backdrop-blur-sm">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
      )}
      <code
        {...codeProps}
        className={cn("-ml-4 block w-max pr-3", codeProps?.className, {
          "animate-pulse": isGeneratingCode,
        })}
        ref={codeProps?.ref}
      >
        <CodeDisplayContent {...rest} />
      </code>
    </pre>
  )
}

export default CodeRenderer

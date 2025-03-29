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
  language: "python" | "html"
  showLineNumbers?: boolean
  isGeneratingCode?: boolean
  preProps?: ComponentProps<"pre">
  codeProps?: ComponentProps<"code">
  fontSize?: "sm" | "lg"
}

const CodeDisplayContent = ({ code, language }: Pick<CodeDisplayProps, "code" | "language">) => {
  const rendered = useMemo(() => {
    const hast = refractor.highlight(code, language) as Nodes
    return toJsxRuntime(hast, { Fragment, jsx: jsx as Jsx, jsxs: jsxs as Jsx })
  }, [code, language])

  return <>{rendered}</>
}

const CodeRenderer = ({
  fontSize = "sm",
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
      className={cn(
        "relative flex w-max flex-1 py-2",
        { "pl-4": showLineNumbers },
        { "text-xs": fontSize === "sm", "text-base": fontSize === "lg" },
        preProps?.className,
      )}
    >
      {showLineNumbers && (
        <div
          className={cn(
            "sticky left-0 top-0 -ml-4 -translate-x-4 select-none bg-dracula/80 pl-4 pr-2 pt-0 text-right text-gray-500 backdrop-blur-sm",
            { "text-xs": fontSize === "sm", "text-base": fontSize === "lg" },
          )}
        >
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
      )}
      <code
        className={cn("block w-max pr-3", codeProps?.className, {
          "animate-pulse": isGeneratingCode,
          "-ml-4": showLineNumbers,
          "p-3": !showLineNumbers,
        })}
        {...codeProps}
        ref={codeProps?.ref}
      >
        <CodeDisplayContent {...rest} />
      </code>
    </pre>
  )
}

export default CodeRenderer

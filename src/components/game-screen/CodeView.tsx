import React from "react"
import CodeDisplay from "../CodeRenderer"

const fakePythonCodeSnippet = `def solution(nums, target):
    indexes = {}
    for i, n in enumerate(nums):
        if n in indexes:
            return indexes[n], i, return indexes[n], i, return indexes[n], i
        else:
            indexes[target - n] = i
    return None, None`

export default function CodeView() {
  return <CodeDisplay code={fakePythonCodeSnippet} language="python" showLineNumbers />
}

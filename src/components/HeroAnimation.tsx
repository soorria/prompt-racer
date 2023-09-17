"use client"
import React, { useState, useEffect } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { python } from "@codemirror/lang-python"
import { dracula } from "@uiw/codemirror-theme-dracula"
import { Loader2, Send } from "lucide-react"
import { Button } from "./ui/button"

type Props = {}

const entireCode = `
class Solution(object):
    def twoSum(self, nums, target):
        dict={}
        for i,n in enumerate(nums):
            if n in dict:
                return dict[n],i
            else:
                dict[target-n]=i
`

function extractChunks(code: string, chunkSize: number = 5): string[] {
  const chunks = []
  for (let i = 0; i < code.length; i += chunkSize) {
    chunks.push(code.substring(i, i + chunkSize))
  }
  return chunks
}

const codeChunks = extractChunks(entireCode.trim())
const inputText = "write up how to do two sum"
const inputChunks = extractChunks(inputText, 1)

export default function HeroAnimation({}: Props) {
  const [currentCodeChunkIndex, setCurrentCodeChunkIndex] = useState(0)
  const [currentInputChunkIndex, setCurrentInputChunkIndex] = useState(0)
  const [showLoader, setShowLoader] = useState(false)

  const codeToShow = codeChunks.slice(0, currentCodeChunkIndex + 1).join("")
  const inputToShow = inputChunks.slice(0, currentInputChunkIndex + 1).join("")

  useEffect(() => {
    let inputInterval: NodeJS.Timeout
    let codeInterval: NodeJS.Timeout

    if (currentInputChunkIndex < inputChunks.length - 1) {
      inputInterval = setInterval(() => {
        setCurrentInputChunkIndex((prev) => prev + 1)
      }, 100)
    } else if (currentCodeChunkIndex < codeChunks.length - 1) {
      if (!showLoader) setShowLoader(true) // This ensures that the loader only sets to true once

      codeInterval = setInterval(() => {
        setCurrentCodeChunkIndex((prev) => prev + 1)
      }, 250)
    } else if (showLoader) {
      setShowLoader(false) // Ensure that the loader only sets to false once after code animation
    }

    // Cleanup intervals
    return () => {
      if (inputInterval) clearInterval(inputInterval)
      if (codeInterval) clearInterval(codeInterval)
    }
  }, [currentInputChunkIndex, currentCodeChunkIndex, showLoader])

  return (
    <div>
      <div className="bg-dracula w-full rounded-xl overflow-y-scroll h-full ">
        <CodeMirror value={codeToShow} extensions={[python()]} theme={dracula} editable={false} />
      </div>
      <div className="mt-4 flex">
        <input
          value={inputToShow}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
          id="message"
          name="message"
          placeholder="Type your instructions..."
          autoComplete="off"
          required
          disabled={false}
        />
        <Button type="submit" disabled={false}>
          {showLoader ? <Loader2 className="animate-spin h-5 w-5" /> : <Send className="w-5 h-5" />}

          <span className="sr-only">Send</span>
        </Button>
      </div>
    </div>
  )
}

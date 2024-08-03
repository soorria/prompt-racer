"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import clsx from "clsx"
import { Loader2, Send } from "lucide-react"

import { noop } from "~/lib/utils"
import CodeDisplay from "../CodeRenderer"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

const examples = [
  {
    // two sum
    code: `
def solution(nums, target):
    indexes = {}
    for i, n in enumerate(nums):
        if n in indexes:
            return indexes[n], i
        else:
            indexes[target - n] = i
`,
    input: "return the indices of two numbers that add up to the target",
  },
  {
    // reverse linked list
    code: `
def solution(head):
    prev = None
    curr = head
    while curr:
        next = curr.next
        curr.next = prev
        prev = curr
        curr = next
    return prev
`,
    input: "reverse the linked list in place and return the new head",
  },
].map((example) => {
  const code = example.code.trim()
  return {
    ...example,
    code,
    codeChunks: extractChunks(code, 5),
    inputChunks: extractChunks(example.input, 1),
  }
})

export const numExamples = examples.length

function extractChunks(code: string, chunkSize = 5): string[] {
  const chunks = []
  for (let i = 0; i < code.length; i += chunkSize) {
    chunks.push(code.substring(i, i + chunkSize))
  }
  return chunks
}

const CHUNK_DELAY_MS = 50
const STEP_BUFFERS = {
  waitingForLLM: 10,
  waitBeforeSubmit: 10,
  submittingCode: 50,
}

export default function HeroAnimation() {
  const [animateContainerRef] = useAutoAnimate()

  const [exampleIndex, setExampleIndex] = useState(0)
  const example = examples[exampleIndex]!

  const [step, setStep] = useState(0)

  const stepMilestones = useMemo(() => {
    const endInput = example.inputChunks.length
    const startGeneratingCode = endInput + STEP_BUFFERS.waitingForLLM
    const startSubmitting =
      startGeneratingCode + example.codeChunks.length + STEP_BUFFERS.waitBeforeSubmit
    const total = startSubmitting + STEP_BUFFERS.submittingCode

    return {
      input: endInput,
      startGeneratingCode,
      startSubmitting,
      total,
    }
  }, [example])

  const currentInputChunkIndex = Math.min(step, stepMilestones.input)
  const currentCodeChunkIndex = Math.max(
    0,
    step - example.inputChunks.length - STEP_BUFFERS.waitingForLLM,
  )
  const showLoader =
    step > stepMilestones.startGeneratingCode && step < stepMilestones.startSubmitting
  const showSubmittingFakeModal = step > stepMilestones.startSubmitting
  const complete = step === stepMilestones.total

  const inputToShow = example.inputChunks.slice(0, currentInputChunkIndex).join("")
  const codeToShow = example.codeChunks.slice(0, currentCodeChunkIndex).join("")

  useEffect(() => {
    let nextExampleTimeout: ReturnType<typeof setTimeout>
    const stepInterval = setInterval(() => {
      let complete = false
      setStep((step) => {
        if (step === stepMilestones.total) {
          complete = true
        }
        return Math.min(step + 1, stepMilestones.total)
      })

      if (complete) {
        nextExampleTimeout = setTimeout(() => {
          setExampleIndex((exampleIndex) => (exampleIndex + 1) % numExamples)
          setStep(0)
        }, 5_000)
        clearInterval(stepInterval)
      }
    }, CHUNK_DELAY_MS)

    return () => {
      clearInterval(stepInterval)
      if (nextExampleTimeout) {
        clearTimeout(nextExampleTimeout)
      }
    }
  }, [example, stepMilestones])

  const showSubmittingOpacityClass = showSubmittingFakeModal ? "opacity-40" : "opacity-100"

  return (
    <div
      className="relative flex flex-col items-center justify-center overflow-hidden rounded-b rounded-t-xl"
      ref={animateContainerRef}
    >
      {codeToShow ? (
        <div
          className={clsx(
            "h-full w-full overflow-y-scroll rounded-xl bg-dracula transition-all",
            showSubmittingOpacityClass,
          )}
        >
          <CodeDisplay code={codeToShow} language="python" />
        </div>
      ) : null}
      <div
        className={clsx(
          "pointer-events-none mt-4 flex w-full transition-all",
          showSubmittingOpacityClass,
        )}
      >
        <Input
          value={inputToShow}
          id="message"
          name="message"
          placeholder="Type your instructions..."
          autoComplete="off"
          className="rounded-r-none"
          required
          disabled={showLoader}
          // this is to stop React's warning about controlled inputs
          onChange={noop}
        />
        <Button type="submit" disabled={false} variant={"secondary"} className="rounded-l-none">
          {showLoader ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}

          <span className="sr-only">Send</span>
        </Button>
      </div>

      <div>
        {showSubmittingFakeModal && (
          <div className="animate-fade-in absolute inset-0 grid place-items-center">
            <div className="rounded bg-zinc-600 px-6 py-4">
              {complete ? (
                <div className="flex flex-col items-center gap-4">
                  <p className="font-display text-xl text-primary">🥇 1ST PLACE 🥇</p>
                  <p className="text-7xl">🏆</p>
                  <p className="text-zinc-400">5/5 tests passing</p>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  Submitting your code
                  <Loader2 size={16} className="animate-spin text-primary" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

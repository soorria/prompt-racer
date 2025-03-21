"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import clsx from "clsx"
import { Loader2, Send } from "lucide-react"

import { noop } from "~/lib/utils"
import CodeRenderer from "../CodeRenderer"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

const examples = [
  {
    // Circle animation
    code: `
<div class="canvas">
  <!-- Background layer -->
  <div class="background"></div>
  
  <!-- Main purple circle -->
  <div class="circle">
    <!-- Inner gold circle -->
    <div class="inner-circle"></div>
  </div>
</div>
`,
    input: "generate a purple circle with a gold center",
    imageSteps: [
      // Background layer
      "bg-neutral-900 w-full h-full absolute rounded-lg",
      // Empty circle outline
      "w-[100px] h-[100px] rounded-full border-2 border-dashed border-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
      // Purple circle fill
      "w-[100px] h-[100px] rounded-full bg-purple-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
      // Empty inner circle outline
      "w-[50px] h-[50px] rounded-full border-2 border-dashed border-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
      // Gold inner circle fill
      "w-[50px] h-[50px] rounded-full bg-yellow-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    ],
  },
  {
    // Landscape image
    code: `
<div class="canvas">
  <!-- Sky background -->
  <div class="sky"></div>
  
  <!-- Sun -->
  <div class="sun"></div>
  
  <!-- Hills -->
  <div class="hills"></div>
</div>
`,
    input: "create a simple landscape with hills and sun",
    imageSteps: [
      // Empty canvas
      "border-2 border-dashed border-gray-400 w-full h-full absolute rounded-lg",
      // Sky background fill
      "bg-sky-300 w-full h-full absolute rounded-lg",
      // Sun outline
      "w-[80px] h-[80px] rounded-full border-2 border-dashed border-gray-400 absolute top-[50px] left-[50px]",
      // Sun fill
      "w-[80px] h-[80px] rounded-full bg-yellow-300 absolute top-[50px] left-[50px]",
      // Hills outline
      "absolute bottom-0 h-[50px] w-full border-t-2 border-dashed border-gray-400 rounded-t-[100px] rounded-b-lg",
      // Hills fill
      "absolute bottom-0 h-[50px] w-full bg-green-600 rounded-t-[100px] rounded-b-lg",
    ],
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
const IMAGE_STEP_DELAY_MS = 300
const STEP_BUFFERS = {
  waitingForLLM: 10,
  waitBeforeSubmit: 10,
  waitBeforeImageAnalysis: 40,
  imageAnalysis: 50,
}

export default function HeroImageAnimation() {
  const [animateContainerRef] = useAutoAnimate()

  const [exampleIndex, setExampleIndex] = useState(0)
  const example = examples[exampleIndex]!

  const [step, setStep] = useState(0)
  const [imageStepIndex, setImageStepIndex] = useState(0)

  const stepMilestones = useMemo(() => {
    const endInput = example.inputChunks.length
    const startGeneratingCode = endInput + STEP_BUFFERS.waitingForLLM
    const startImageAnimation =
      startGeneratingCode + example.codeChunks.length + STEP_BUFFERS.waitBeforeSubmit
    const startAnalyzing = startImageAnimation + STEP_BUFFERS.waitBeforeImageAnalysis
    const total = startAnalyzing + STEP_BUFFERS.imageAnalysis

    return {
      input: endInput,
      startGeneratingCode,
      startImageAnimation,
      startAnalyzing,
      total,
    }
  }, [example])

  const currentInputChunkIndex = Math.min(step, stepMilestones.input)
  const currentCodeChunkIndex = Math.max(
    0,
    Math.min(example.codeChunks.length, step - stepMilestones.input - STEP_BUFFERS.waitingForLLM),
  )

  const showLoader = step > stepMilestones.input && step < stepMilestones.startGeneratingCode
  const showImageAnimation = step >= stepMilestones.startImageAnimation
  const showAnalyzing = step >= stepMilestones.startAnalyzing
  const complete = step === stepMilestones.total

  const inputToShow = example.inputChunks.slice(0, currentInputChunkIndex).join("")
  const codeToShow = example.codeChunks.slice(0, currentCodeChunkIndex).join("")

  // Main step animation
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
          setImageStepIndex(0)
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

  // Separate animation for image steps - slower to emphasize the process
  useEffect(() => {
    if (!showImageAnimation || imageStepIndex >= example.imageSteps.length) {
      return
    }

    const imageStepInterval = setInterval(() => {
      setImageStepIndex((idx) => {
        const nextIdx = idx + 1
        if (nextIdx >= example.imageSteps.length) {
          clearInterval(imageStepInterval)
        }
        return nextIdx
      })
    }, IMAGE_STEP_DELAY_MS)

    return () => {
      clearInterval(imageStepInterval)
    }
  }, [showImageAnimation, example.imageSteps.length, imageStepIndex])

  const showAnalyzingOpacityClass = showAnalyzing ? "opacity-40" : "opacity-100"

  return (
    <div
      className="relative flex w-full max-w-md flex-col items-center justify-center overflow-hidden rounded-b rounded-t-xl"
      ref={animateContainerRef}
    >
      <div
        className={clsx(
          "relative h-full w-full overflow-hidden rounded-2xl rounded-b-none bg-dracula transition-all",
          showAnalyzingOpacityClass,
        )}
      >
        {/* Code Section */}
        <CodeRenderer
          code={codeToShow}
          language="html"
          preProps={{ className: "h-40 w-full w-[20rem] text-left pl-3 " }}
          codeProps={{ className: "w-full" }}
        />
        {!codeToShow && (
          <div
            className="absolute left-3 top-2 inline-block h-4 w-1 animate-[blink_1s_ease-in-out_infinite] bg-white/80"
            style={{
              animation: "blink 1s step-end infinite",
            }}
          ></div>
        )}
      </div>

      {/* Input Section */}
      <div
        className={clsx(
          "pointer-events-none flex w-full transition-all",
          showAnalyzingOpacityClass,
        )}
      >
        <Input
          value={inputToShow}
          id="message"
          name="message"
          placeholder="Type your image prompt..."
          autoComplete="off"
          className="rounded-2xl rounded-r-none rounded-t-none"
          required
          disabled={showLoader}
          onChange={noop}
        />
        <Button
          type="submit"
          disabled={false}
          variant={"secondary"}
          className="rounded-2xl rounded-l-none rounded-t-none"
        >
          {showLoader ? <Loader2 className="animate-spin sq-5" /> : <Send className="sq-5" />}
          <span className="sr-only">Generate</span>
        </Button>
      </div>

      <div>
        {/* Image Overlay */}
        {showImageAnimation && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="relative h-5/6 w-5/6">
              {example.imageSteps.slice(0, imageStepIndex).map((className, idx) => (
                <div
                  key={idx}
                  className={clsx(className, "animate-fade-in transition-all duration-300")}
                />
              ))}
            </div>
          </div>
        )}
        {/* Analysis Overlay */}
        {showAnalyzing && (
          <div className="animate-fade-in absolute inset-0 z-20 grid select-none place-items-center">
            <div className="rounded bg-accent px-6 py-4">
              {complete ? (
                <div className="flex flex-col items-center gap-4">
                  <p className="font-display text-xl text-primary">🎨 PERFECT MATCH 🎨</p>
                  <p className="text-7xl">🔍</p>
                  <p className="text-zinc-400">100% accuracy</p>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  Analyzing image
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

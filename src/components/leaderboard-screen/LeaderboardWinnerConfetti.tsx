"use client"

import type JSConfetti from "js-confetti"
import type { ReactNode } from "react"
import { useEffect } from "react"
import { ArchiveX, PartyPopper } from "lucide-react"

import { DRACULA_COLORS } from "~/lib/colors/constants"
import { useLocalStorage } from "~/lib/utils/use-local-storage.client-only"
import { Button } from "../ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

export function LeaderboardWinnerConfetti({ once }: { once?: boolean }): ReactNode {
  const [confettiEnabled, setConfettiEnabled] = useLocalStorage("promptracer:confettiEnabled", true)

  useEffect(() => {
    if (!confettiEnabled) {
      return
    }

    let safe = true

    let confetti: JSConfetti
    let lastConfetti: Promise<void>

    function doConfetti() {
      lastConfetti = confetti?.addConfetti({
        confettiColors: DRACULA_COLORS,
      })
    }

    async function doThings() {
      const { default: JSConfetti } = await import("js-confetti")

      if (safe) {
        confetti = new JSConfetti()
        doConfetti()
      }
    }

    if (once) {
      void doThings()
    } else {
      const interval = setInterval(() => {
        if (safe) {
          doConfetti()
        }
      }, 750)

      void doThings()

      return () => {
        safe = false
        clearInterval(interval)
        void lastConfetti?.then(() => confetti?.destroyCanvas())
      }
    }
  }, [confettiEnabled, once])

  if (once) {
    return null
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          className="fixed bottom-4 left-4 z-50 sm:bottom-8 sm:left-8"
          size="icon-sm"
          onClick={() => setConfettiEnabled((v) => !v)}
        >
          {confettiEnabled ? <ArchiveX /> : <PartyPopper />}
        </Button>
      </TooltipTrigger>

      <TooltipContent>
        {confettiEnabled ? "Clean up confetti" : "Unleash the power of confetti"}
      </TooltipContent>
    </Tooltip>
  )
}

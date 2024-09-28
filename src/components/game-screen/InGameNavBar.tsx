"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { addMilliseconds } from "date-fns"
import { Settings } from "lucide-react"
import { toast } from "sonner"

import Navbar from "~/lib/surfaces/navbar/Navbar"
import { api } from "~/lib/trpc/react"
import { Button } from "../ui/button"
import ResponsiveDialog from "../ui/ResponsiveDialog"
import { CountdownTimer } from "./CountdownTimer"
import { useGameManager } from "./GameManagerProvider"

export default function InGameNavBar() {
  const { gameInfo, gameSessionInfo } = useGameManager()
  const trpcUtils = api.useUtils()
  const exitGameEarlyMutation = api.games.exitGameEarly.useMutation({
    onSuccess: () => {
      trpcUtils.games.getGameStateWithQuestion.invalidate()
    },
  })
  const [hasShownEarlyExitToast, setHasShownEarlyExitToast] = useState(false)
  const gameSessionResults = gameSessionInfo.submissionState?.results
  const canExitEarly = gameInfo.status === "inProgress" && gameInfo.players.length === 1
  const shouldShowExitEarlyToast =
    (canExitEarly && gameSessionResults?.length && gameSessionResults.every((r) => r.is_correct)) ??
    false

  let logo = (
    <>
      PROMPT<div className="text-primary">RACER</div>
    </>
  )
  if (gameInfo.status === "waitingForPlayers") {
    logo = (
      <>
        FINDING<div className="text-yellow-500">RACERS</div>
      </>
    )
  }
  if (gameInfo.status === "inProgress") {
    logo = (
      <>
        IN<div className="text-yellow-500">PROGRESS</div>
      </>
    )
  }

  const earlyExit = () => {
    exitGameEarlyMutation.mutate({ game_id: gameInfo.id })
  }

  useEffect(() => {
    if (shouldShowExitEarlyToast && !hasShownEarlyExitToast) {
      toast.success("Consensus reached! Would you like to exit the game early?", {
        position: "top-right",
        closeButton: true,
        action: {
          label: "Exit early",
          onClick: earlyExit,
        },
      })
      setHasShownEarlyExitToast(true)
    }
  }, [shouldShowExitEarlyToast, hasShownEarlyExitToast])

  return (
    <Navbar
      leftContent={
        <div className="flex flex-1 items-center gap-4 font-display">
          <span className="text-md flex w-fit">{logo}</span>

          {gameInfo.status === "inProgress" && gameInfo.start_time ? (
            <CountdownTimer
              endTime={addMilliseconds(
                gameInfo.start_time,
                gameInfo.in_progress_duration_ms,
              ).getTime()}
            />
          ) : null}
        </div>
      }
      rightContent={
        <ResponsiveDialog
          title="Game settings"
          renderTrigger={(props) => (
            <Button
              className="h-fit p-1"
              onClick={props.openDialog}
              Icon={() => <Settings className="mr-0 sq-4 sm:h-5 sm:w-5" />}
              variant={"ghost"}
            />
          )}
          renderContent={(props) => (
            <>
              {canExitEarly && <Button onClick={earlyExit}>Exit early</Button>}
              <Button asChild className="w-full" variant={"outline"}>
                <Link href="/" onClick={props.closeDialog}>
                  Go to home
                </Link>
              </Button>
            </>
          )}
        />
      }
      className="mb-3 h-8 p-0 px-5 sm:h-16 sm:p-5"
    />
  )
}

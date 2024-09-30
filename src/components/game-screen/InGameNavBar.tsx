"use client"

import React, { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { addMilliseconds } from "date-fns"
import { Ellipsis } from "lucide-react"
import { toast } from "sonner"

import Navbar from "~/lib/surfaces/navbar/Navbar"
import { api } from "~/lib/trpc/react"
import AdminSettings from "../AdminSettings"
import { Button } from "../ui/button"
import ResponsiveDialog from "../ui/ResponsiveDialog"
import { CountdownTimer } from "./CountdownTimer"
import { useGameManager } from "./GameManagerProvider"

export default function InGameNavBar() {
  const { gameInfo, gameSessionInfo } = useGameManager()
  const trpcUtils = api.useUtils()
  const exitGameEarlyMutation = api.games.exitGameEarly.useMutation({
    onSuccess: () => {
      void trpcUtils.games.getGameStateWithQuestion.invalidate()
    },
  })
  const userQuery = api.auth.getUser.useQuery()
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

  const earlyExit = useCallback(() => {
    exitGameEarlyMutation.mutate({ game_id: gameInfo.id })
  }, [exitGameEarlyMutation, gameInfo.id])

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
  }, [shouldShowExitEarlyToast, hasShownEarlyExitToast, earlyExit])

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
              Icon={() => <Ellipsis className="mr-0 sq-4" />}
              variant={"ghost"}
            />
          )}
          renderContent={(props) => (
            <div className="flex flex-col gap-2">
              {userQuery.data?.role === "admin" && <AdminSettings gameId={gameInfo.id} />}
              {canExitEarly && <Button onClick={earlyExit}>Exit early</Button>}
              <Button asChild className="w-full" variant={"outline"}>
                <Link href="/" onClick={props.closeDialog}>
                  Go to home
                </Link>
              </Button>
            </div>
          )}
        />
      }
      className="mb-3 h-8 p-0 px-5 sm:h-16 sm:p-5"
    />
  )
}

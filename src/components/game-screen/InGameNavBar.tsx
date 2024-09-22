"use client"

import React from "react"
import Link from "next/link"
import { addMilliseconds } from "date-fns"
import { Settings } from "lucide-react"

import Navbar from "~/lib/surfaces/navbar/Navbar"
import { Button } from "../ui/button"
import ResponsiveDialog from "../ui/ResponsiveDialog"
import { CountdownTimer } from "./CountdownTimer"
import { useGameManager } from "./GameManagerProvider"

export default function InGameNavBar() {
  const { gameInfo } = useGameManager()
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
              Icon={() => <Settings className="mr-0 h-4 w-4 sm:h-5 sm:w-5" />}
              variant={"ghost"}
            />
          )}
          renderContent={(props) => (
            <>
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

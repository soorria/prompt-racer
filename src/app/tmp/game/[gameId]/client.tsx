"use client"

import { Button } from "~/components/ui/button"
import { leaveGameAction, sendMessageInGameAction, submitCodeAction } from "~/lib/games/actions"

type LeaveGameButtonProps = {
  gameId: string
}

export function LeaveGameButton(props: LeaveGameButtonProps) {
  return (
    <Button
      variant="destructive"
      onClick={() => {
        leaveGameAction({
          game_id: props.gameId,
        })
      }}
    >
      Leave game
    </Button>
  )
}

export function SendMessage(props: { gameId: string }) {
  return (
    <form
      action={async (formData) => {
        const result = await sendMessageInGameAction({
          game_id: props.gameId,
          instructions: formData.get("message") as string,
        })
        console.log(result)
      }}
    >
      <textarea name="message" className="text-background"></textarea>
      <button>Send</button>
    </form>
  )
}

export function SubmitCode(props: { gameId: string; submissionType: "test-run" | "submission" }) {
  return (
    <Button
      onClick={async () => {
        const result = await submitCodeAction({
          game_id: props.gameId,
          submission_type: props.submissionType,
        })
        console.log(result)
      }}
    >
      Submit code {props.submissionType}
    </Button>
  )
}

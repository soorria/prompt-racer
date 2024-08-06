import Link from "next/link"

import { Button } from "~/components/ui/button"
import { requireAuthUser } from "~/lib/auth/user"
import { cmp, db, schema } from "~/lib/db"
import { getGameById } from "~/lib/games/queries"
import { LeaveGameButton, SendMessage, SubmitCode } from "./client"

type TmpGamePageProps = {
  params: {
    gameId: string
  }
}

export default async function TmpGamePage(props: TmpGamePageProps) {
  const user = await requireAuthUser()
  const game = await getGameById(db, props.params.gameId)

  const session = await db.query.playerGameSessions.findFirst({
    where: cmp.and(
      cmp.eq(schema.playerGameSessions.user_id, user.id),
      cmp.eq(schema.playerGameSessions.game_id, props.params.gameId),
    ),
    with: {
      submissionState: {
        with: {
          results: true,
        },
      },
      testState: {
        with: {
          results: true,
        },
      },
      chatHistory: true,
      finalResult: true,
    },
  })

  return (
    <div>
      <LeaveGameButton gameId={props.params.gameId} />
      <Button asChild>
        <Link href="/tmp/game">Back</Link>
      </Button>
      <SubmitCode gameId={props.params.gameId} submissionType="test-run" />
      <SubmitCode gameId={props.params.gameId} submissionType="submission" />
      <SendMessage gameId={props.params.gameId} />
      <pre>
        {JSON.stringify(
          {
            game,
            session,
          },
          null,
          2,
        )}
      </pre>
    </div>
  )
}

import "server-only"

import { subWeeks } from "date-fns"

import { cmp, schema } from "~/lib/db"
import { type DBOrTransaction } from "~/lib/db/types"
import { type GameEvent } from "./schema"

const ALL_USERS: unique symbol = Symbol("push-event:all-users")
export async function pushGameEvent(
  db: DBOrTransaction,
  args: { gameId: string; event: GameEvent; userId: string | typeof ALL_USERS },
) {
  await db.insert(schema.gameEvents).values({
    game_id: args.gameId,
    payload: args.event,
    user_id: args.userId === ALL_USERS ? null : args.userId,
  })
}
pushGameEvent.ALL_USERS = ALL_USERS

export async function deleteOldGameEvents(db: DBOrTransaction) {
  const oneWeekAgo = subWeeks(new Date(), 1)
  await db.delete(schema.gameEvents).where(cmp.lte(schema.gameEvents.inserted_at, oneWeekAgo))
}

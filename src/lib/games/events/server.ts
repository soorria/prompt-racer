import "server-only"

import { schema } from "~/lib/db"
import { type DBOrTransation } from "~/lib/db/types"
import { type GameEvent } from "./schema"

const ALL_USERS: unique symbol = Symbol("push-event:all-users")
export async function pushEvent(
  db: DBOrTransation,
  args: { gameId: string; event: GameEvent; userId: string | typeof ALL_USERS },
) {
  await db.insert(schema.gameEvents).values({
    game_id: args.gameId,
    payload: args.event,
    user_id: args.userId === ALL_USERS ? null : args.userId,
  })
}
pushEvent.ALL_USERS = ALL_USERS

import "server-only"

import { schema } from "~/lib/db"
import { type DBOrTransation } from "~/lib/db/types"
import { type GameEvent } from "./schema"

export async function pushEvent(
  db: DBOrTransation,
  args: { gameId: string; event: GameEvent; userId: string | null },
) {
  await db.insert(schema.gameEvents).values({
    game_id: args.gameId,
    payload: args.event,
    user_id: args.userId,
  })
}

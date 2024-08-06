import { EventSchemas, Inngest } from "inngest"

export type InngestEvents = {
  "game/started": {
    data: {
      game_id: string
      waiting_for_players_duration_ms: number
      in_progress_duration_ms: number
    }
  }
  "game/cancelled": {
    data: {
      game_id: string
    }
  }
}

export const inngest = new Inngest({
  id: "prompt-racer-api" as const,
  schema: new EventSchemas().fromRecord<InngestEvents>(),
})

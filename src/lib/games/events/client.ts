import { useEffect } from "react"
import { type SupabaseClient } from "@supabase/supabase-js"

import { type Doc } from "~/lib/db/types"
import { useStableCallback } from "~/lib/utils/use-stable-callback"
import { type GameEvent } from "./schema"

export function useHandleGameEvent(props: {
  supabase: SupabaseClient
  gameId: string
  handleEvent: (event: GameEvent) => void
}) {
  const stableHandleEvent = useStableCallback(props.handleEvent)

  useEffect(() => {
    // TODO: should this be handled by the consumer?
    let safe = true

    const gameStateChannel = props.supabase
      .channel("gameEvents")
      .on<Doc<"gameEvents">>(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "game_events",
          filter: `game_id=eq.${props.gameId}`,
        },
        (payload) => {
          if (!safe) return

          console.log(payload)

          stableHandleEvent(payload.new.payload)
        },
      )
      .subscribe()

    return () => {
      void gameStateChannel.unsubscribe()
      void props.supabase
        .removeChannel(gameStateChannel)
        .catch((e) => console.error("failed to remove channel", e))
      safe = false
    }
  }, [props.gameId, props.supabase, stableHandleEvent])
}

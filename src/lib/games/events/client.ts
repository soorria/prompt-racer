import { useEffect } from "react"
import { type SupabaseClient } from "@supabase/supabase-js"

import { type Doc } from "~/lib/db/types"
import { useStableCallback } from "~/lib/utils/use-stable-callback"
import { type ClientGameState } from "../types"
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

export function gameEventReducer(state: ClientGameState, event: GameEvent): ClientGameState {
  if (event.type in gameEventReducers) {
    return {
      ...state,
      ...gameEventReducers[event.type](state, event),
    } as ClientGameState
  }

  if (process.env.NODE_ENV === "development") {
    throw new Error(`Got unknown event type ${event.type} - full payload: ${JSON.stringify(event)}`)
  }

  return state
}

type GameEventReducers = {
  [EventType in GameEvent["type"]]: (
    state: ClientGameState,
    event: Extract<GameEvent, { type: EventType }>,
  ) => Partial<ClientGameState>
}
const gameEventReducers: GameEventReducers = {
  "player-joined"(state, event) {
    return {
      gameState: {
        ...state.gameState,
        players: [
          ...state.gameState.players,
          {
            user: event.data.player,
          },
        ],
      },
    }
  },
}

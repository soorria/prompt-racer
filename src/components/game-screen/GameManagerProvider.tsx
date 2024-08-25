"use client"

import { useEffect } from "react"
import { useMutation } from "@tanstack/react-query"

import type { GameStateWithQuestion, PlayerGameSession } from "~/lib/games/types"
import { sendMessageInGameAction } from "~/lib/games/actions"
import { createBrowserClient } from "~/lib/supabase/browser"
import { api } from "~/lib/trpc/react"
import { createTypedContext } from "~/lib/utils/context"

export const [GameManagerProvider, useGameManager] = createTypedContext(
  (props: { initialGameState: GameStateWithQuestion; initialPlayerSession: PlayerGameSession }) => {
    const gameSessionQuery = useGameSessionForUser({
      initialSession: props.initialPlayerSession,
    })

    const gameStateQuery = useGameState({
      initialState: props.initialGameState,
    })

    const updateCurrentCodeMutation = useMutation({
      mutationFn: (code: string) =>
        sendMessageInGameAction({ game_id: gameSessionQuery.data.game_id, instructions: code }),
      onSuccess: () => gameSessionQuery.refetch(),
    })

    return {
      gameInfo: gameStateQuery.data,
      gameSessionInfo: gameSessionQuery.data,
      updateCurrentCodeMutation,
    }
  },
)

function useGameState({ initialState }: { initialState: GameStateWithQuestion }) {
  const utils = api.useUtils()

  const gameId = initialState.id

  const gameStateQuery = api.games.getGameStateWithQuestion.useQuery(
    { game_id: gameId },
    { initialData: initialState },
  )

  const supabase = createBrowserClient()

  useEffect(() => {
    let safe = true

    const gameStateChannel = supabase
      .channel("gameState")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "game_states",
          filter: `id=eq.${gameId}`,
        },
        (payload) => {
          if (!safe) return

          if (payload.eventType === "DELETE") {
            // TODO: handle deleted e.g. when leaving a game
          }

          console.log("payload", payload)

          utils.games.getGameStateWithQuestion.setData(
            {
              game_id: gameId,
            },
            (game) => (game ? { ...game, ...payload.new } : undefined),
          )
          // NOTE: no refetch since relations do not change
        },
      )
      .subscribe()

    return () => {
      void gameStateChannel.unsubscribe()
      void supabase
        .removeChannel(gameStateChannel)
        .catch((e) => console.error("failed to remove channel", e))
      safe = false
    }
  }, [utils, gameId, supabase])

  return gameStateQuery
}

function useGameSessionForUser({ initialSession }: { initialSession: PlayerGameSession }) {
  const utils = api.useUtils()
  const gameSessionInfoQuery = api.games.getPlayerGameSession.useQuery(
    { game_id: initialSession.game_id },
    { initialData: initialSession },
  )
  const sessionId = gameSessionInfoQuery.data.id
  const gameId = gameSessionInfoQuery.data.game_id

  const supabase = createBrowserClient()

  useEffect(() => {
    let safe = true

    const gameSessionChannel = supabase
      .channel("gameSessionInfo")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "player_game_sessions",
          filter: `id=eq.${sessionId}`,
        },
        (payload) => {
          if (!safe) return

          if (payload.eventType === "DELETE") {
            // TODO: handle deleted e.g. when leaving a game
          }

          utils.games.getPlayerGameSession.setData(
            {
              game_id: gameId,
            },
            (game) => (game ? { ...game, ...payload.new } : undefined),
          )
          void utils.games.getPlayerGameSession.invalidate()
        },
      )
      .subscribe()

    return () => {
      void gameSessionChannel.unsubscribe()
      void supabase
        .removeChannel(gameSessionChannel)
        .catch((e) => console.error("failed to remove channel", e))
      safe = false
    }
  }, [supabase, sessionId, gameId, utils])

  return gameSessionInfoQuery
}

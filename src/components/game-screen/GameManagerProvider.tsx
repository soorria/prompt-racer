"use client"

import { useEffect } from "react"
import { useMediaQuery } from "@react-hook/media-query"
import { type User } from "@supabase/supabase-js"
import { useMutation } from "@tanstack/react-query"
import { useCompletion } from "ai/react"

import type { InGameState, PlayerGameSession } from "~/lib/games/types"
import { extractCodeFromRawCompletion } from "~/lib/llm/utils"
import { createBrowserClient } from "~/lib/supabase/browser"
import { api } from "~/lib/trpc/react"
import { createTypedContext } from "~/lib/utils/context"
import { MOBILE_VIEWPORT } from "./InProgressGame"

export const [GameManagerProvider, useGameManager] = createTypedContext(
  (props: {
    initialGameState: InGameState
    initialPlayerSession: PlayerGameSession
    user: User
  }) => {
    const isMobile = useMediaQuery(MOBILE_VIEWPORT)

    const gameSessionQuery = useGameSessionForUser({
      initialSession: props.initialPlayerSession,
    })

    const gameStateQuery = useGameState({
      initialState: props.initialGameState,
    })

    const completion = useGenerateUpdatedCode({
      gameId: gameSessionQuery.data.game_id,
    })

    const updateCurrentCodeMutation = useMutation({
      mutationFn: (code: string) => completion.complete(code),
      // ? may not need w/ the realtime stuff
      onSuccess: () => gameSessionQuery.refetch(),
    })

    const submitCodeMutation = api.games.submitCode.useMutation()

    const leaveGameMutation = api.games.leave.useMutation()

    return {
      isMobile,
      gameInfo: gameStateQuery.data,
      gameSessionInfo: {
        ...gameSessionQuery.data,
        code: completion.completion ?? gameSessionQuery.data.code,
      },
      updateCurrentCodeMutation,
      isGeneratingCode: completion.isLoading,
      submitCodeMutation,
      leaveGameMutation,
      user: props.user,
    }
  },
)

function useGameState({ initialState }: { initialState: InGameState }) {
  const utils = api.useUtils()

  const gameId = initialState.id

  const gameStateQuery = api.games.getGameStateWithQuestion.useQuery(
    { game_id: gameId },
    { initialData: initialState, refetchOnWindowFocus: true },
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

          void gameStateQuery.refetch()
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

function useGenerateUpdatedCode(props: { gameId: string }) {
  const completion = useCompletion({
    api: "/api/game/send-message",
    body: {
      gameId: props.gameId,
    },
  })

  return {
    ...completion,
    completion: extractCodeFromRawCompletion(completion.completion),
  }
}

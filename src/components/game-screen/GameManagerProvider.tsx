"use client"

import React from "react"
import { useMutation } from "@tanstack/react-query"
import ms from "ms"

import type { GameWithQuestion, SessionInfo } from "~/lib/games/types"
import { sendMessageInGameAction } from "~/lib/games/actions"
import { api } from "~/lib/trpc/react"
import { createTypedContext } from "~/lib/utils/context"

const [Provider, useGameManager] = createTypedContext(
  (props: { gameInfo: GameWithQuestion; sessionInfo: SessionInfo }) => {
    const { gameInfo, sessionInfo } = props
    const gameSessionInfoQuery = api.gameSessionInfo.useQuery(
      { game_id: sessionInfo.game_id },
      { initialData: sessionInfo, refetchInterval: ms("1s") },
    )

    const updateCurrentCodeMutation = useMutation({
      mutationFn: (code: string) =>
        sendMessageInGameAction({ game_id: sessionInfo.game_id, instructions: code }),
      onSuccess: () => gameSessionInfoQuery.refetch(),
    })

    return {
      gameInfo,
      gameSessionInfo: gameSessionInfoQuery.data,
      updateCurrentCodeMutation,
    }
  },
)
export { useGameManager }

export function GameManagerProvider({
  children,
  gameInfo,
  sessionInfo,
}: {
  children: React.ReactNode
  gameInfo: GameWithQuestion
  sessionInfo: SessionInfo
}) {
  return (
    <Provider gameInfo={gameInfo} sessionInfo={sessionInfo}>
      {children}
    </Provider>
  )
}

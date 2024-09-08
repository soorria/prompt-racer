import { addMilliseconds } from "date-fns"

import { CountdownTimer } from "./CountdownTimer"
import { useGameManager } from "./GameManagerProvider"
import LobbyPlayerCard from "./LobbyPlayerCard"

export function Lobby() {
  const { gameInfo, leaveGameMutation, user } = useGameManager()

  const endTime = addMilliseconds(
    gameInfo.start_time,
    gameInfo.waiting_for_players_duration_ms,
  ).getTime()

  return (
    <div className="flex flex-col items-center">
      <div className="my-16 flex flex-col items-center justify-center">
        <h2 className="mb-8 text-xl font-bold text-zinc-400">Game Begins In</h2>
        <CountdownTimer endTime={endTime} />
      </div>
      <LobbyPlayerCard
        user={user}
        players={gameInfo.players ?? []}
        onLeaveGame={() => leaveGameMutation.mutate({ game_id: gameInfo.id })}
      />
      <p className="mt-4 animate-pulse text-gray-600">Waiting for players...</p>
    </div>
  )
}

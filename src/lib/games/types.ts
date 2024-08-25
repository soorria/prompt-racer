import { type getGameStateWithQuestion, type getSessionInfoForPlayer } from "./queries"

export type GameStateWithQuestion = NonNullable<
  Awaited<ReturnType<typeof getGameStateWithQuestion>>
>

export type PlayerGameSession = NonNullable<Awaited<ReturnType<typeof getSessionInfoForPlayer>>>

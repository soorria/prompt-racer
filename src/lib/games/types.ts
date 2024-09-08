import { type getInGameState, type getSessionInfoForPlayer } from "./queries"

export type InGameState = NonNullable<Awaited<ReturnType<typeof getInGameState>>>

export type PlayerGameSession = NonNullable<Awaited<ReturnType<typeof getSessionInfoForPlayer>>>

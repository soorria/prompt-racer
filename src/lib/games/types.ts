import { getSessionInfoForPlayer, type getQuestionForGame } from "./queries"

export type GameWithQuestion = NonNullable<Awaited<ReturnType<typeof getQuestionForGame>>>

export type SessionInfo = NonNullable<Awaited<ReturnType<typeof getSessionInfoForPlayer>>>
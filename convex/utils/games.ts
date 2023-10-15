import { Doc } from "~convex/dataModel"

export type SortablePlayerInfo = Doc<"playerGameInfo"> & {
  state: "submitted"
  submissionState: NonNullable<Doc<"playerGameInfo">["submissionState"]> & {
    type: "complete"
  }
  lastSubmittedAt: number
}
export type PlayerPostions = Record<string, number | "nah">

export const getPlayerPositions = (
  infos: Doc<"playerGameInfo">[],
  sortPlayerInfo: (a: SortablePlayerInfo, b: SortablePlayerInfo) => number
) => {
  const sorted = infos
    .filter(
      (info): info is SortablePlayerInfo =>
        info.state === "submitted" &&
        info.submissionState?.type === "complete" &&
        typeof info.lastSubmittedAt === "number"
    )
    .sort((a, b) => {
      const aPassing = a.submissionState.results.filter((r) => r.status === "success").length
      const bPassing = b.submissionState.results.filter((r) => r.status === "success").length
      const diffPassing = bPassing - aPassing

      if (diffPassing !== 0) {
        return diffPassing
      }

      return sortPlayerInfo(a, b)
    })

  return Object.fromEntries(sorted.map((info, i) => [info.userId, i] as const))
}

const getTotalRuntime = (info: SortablePlayerInfo) => {
  return info.submissionState.results
    .filter((r) => r.status === "success" && r.time)
    .reduce((acc, r) => acc + r.time!, 0)
}
const getTotalWordLength = (info: Doc<"playerGameInfo">) => {
  return info.chatHistory
    .map((m) => (m.role === "user" ? m.content.split(" ").length : 0))
    .reduce((acc, v) => acc + v, 0)
}

export const getPlayerPostionsForGameMode = (
  gameMode: Doc<"game">["mode"],
  playerInfos: Doc<"playerGameInfo">[]
) => {
  let positions: Record<string, number | "nah"> = {}

  if (gameMode === "fastest-player") {
    // sort by submission time, ascending
    positions = getPlayerPositions(playerInfos, (a, b) => {
      const aTime = a.lastSubmittedAt
      const bTime = b.lastSubmittedAt
      const diffTime = aTime - bTime

      return diffTime
    })
  } else if (gameMode === "fastest-code") {
    // sort by total runtime for passing code, ascending
    positions = getPlayerPositions(playerInfos, (a, b) => {
      const aTime = getTotalRuntime(a)
      const bTime = getTotalRuntime(b)
      const diffTime = aTime - bTime

      return diffTime
    })
  } else if (gameMode === "shortest-code") {
    positions = getPlayerPositions(playerInfos, (a, b) => {
      const aCode = a.code
      const bCode = b.code
      const diffCode = aCode.length - bCode.length

      return diffCode
    })
  } else if (gameMode === "shortest-messages-word-length") {
    positions = getPlayerPositions(playerInfos, (a, b) => {
      const aTotal = getTotalWordLength(a)
      const bTotal = getTotalWordLength(b)

      return aTotal - bTotal
    })
  }

  return positions
}

export const getUpdatedPlayerPostions = (
  players: NonNullable<Doc<"game">["players"]>,
  positions: PlayerPostions
) => {
  return players.map((p) => {
    return {
      ...p,
      position: positions[p.userId] ?? "nah",
    }
  })
}

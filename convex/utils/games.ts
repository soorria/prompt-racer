import { Doc } from "~convex/dataModel"

export type SortablePlayerInfo = Doc<"playerGameInfo"> & {
  state: "submitted"
  submissionState: NonNullable<Doc<"playerGameInfo">["submissionState"]> & {
    type: "complete"
  }
  lastSubmittedAt: number
}
export type PlayerPostionsResult = Record<
  string,
  {
    position: number | "nah"
    score: number | "nah"
  }
>

export const getPlayerPositions = (
  infos: Doc<"playerGameInfo">[],
  fns: {
    getScore: (info: SortablePlayerInfo) => number | "nah"
    compareScore: (a: number, b: number) => number
  }
): PlayerPostionsResult => {
  const sorted = infos
    .filter(
      (info): info is SortablePlayerInfo =>
        info.state === "submitted" &&
        info.submissionState?.type === "complete" &&
        typeof info.lastSubmittedAt === "number"
    )
    .map((info) => {
      const numPassing = info.submissionState.results.filter((r) => r.status === "success").length
      return {
        ...info,
        numPassing: numPassing,
        score: numPassing === 0 ? "nah" : fns.getScore(info),
      }
    })
    .sort((a, b) => {
      const diffPassing = b.numPassing - a.numPassing

      if (diffPassing !== 0) {
        return diffPassing
      }

      if (a.score === "nah" && b.score === "nah") {
        return 0
      } else if (a.score === "nah") {
        return 1
      } else if (b.score === "nah") {
        return -1
      }

      return fns.compareScore(a.score, b.score)
    })

  return Object.fromEntries(
    sorted.map((info, i) => [info.userId, { position: i, score: info.score }] as const)
  )
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
  let positions: PlayerPostionsResult = {}

  if (gameMode === "fastest-player") {
    // sort by submission time, ascending
    positions = getPlayerPositions(playerInfos, {
      getScore: (info) => info.lastSubmittedAt,
      compareScore: (a, b) => a - b,
    })
  } else if (gameMode === "fastest-code") {
    // sort by total runtime for passing code, ascending
    positions = getPlayerPositions(playerInfos, {
      getScore: getTotalRuntime,
      compareScore: (a, b) => a - b,
    })
  } else if (gameMode === "shortest-code") {
    positions = getPlayerPositions(playerInfos, {
      getScore: getTotalRuntime,
      compareScore: (a, b) => b - a,
    })
  } else if (gameMode === "shortest-messages-word-length") {
    positions = getPlayerPositions(playerInfos, {
      getScore: getTotalWordLength,
      compareScore: (a, b) => a - b,
    })
  }

  return positions
}

export const getUpdatedPlayerPostions = (
  players: NonNullable<Doc<"game">["players"]>,
  positions: PlayerPostionsResult
): NonNullable<Doc<"game">["players"]> => {
  return players.map((p) => {
    return {
      ...p,
      position: positions[p.userId]?.position ?? "nah",
      score: positions[p.userId]?.score ?? "nah",
    }
  })
}

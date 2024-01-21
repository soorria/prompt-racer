/**
 * This is a slightly simplified JS port of https://github.com/djcunningham0/multielo/tree/main
 */

import { mean, sum, exp, matrix, index, divide, transpose } from "mathjs"

const DEFAULT_K_VALUE = 32
const DEFAULT_D_VALUE = 400
const DEFAULT_SCORING_FUNCTION_BASE = 1

class MultiElo {
  private k: number
  private d: number
  private scoreFunc: (n: number) => number[]
  private logBase: number

  constructor(
    args: {
      kValue?: number
      dValue?: number
      logBase?: number
    } & (
      | {
          scoreFunctionBase?: number
          customScoreFunction?: never
        }
      | {
          scoreFunctionBase?: never
          customScoreFunction?: (n: number) => number[]
        }
    ) = {}
  ) {
    this.k = args.kValue ?? DEFAULT_K_VALUE
    this.d = args.dValue ?? DEFAULT_D_VALUE
    this.scoreFunc =
      args.customScoreFunction ??
      createExponentialScoreFunction(args.scoreFunctionBase ?? DEFAULT_SCORING_FUNCTION_BASE)
    this.logBase = args.logBase ?? 10
  }

  getNewRatings(initialRatings: number[], resultOrder?: number[]): number[] {
    const n = initialRatings.length
    if (n <= 1) {
      return [...initialRatings]
    }
    const actualScores = this.getActualScores(n, resultOrder)
    const expectedScores = this.getExpectedScores(initialRatings)
    const scaleFactor = this.k * (n - 1)
    return initialRatings.map((rating, i) =>
      Math.round(rating + scaleFactor * (actualScores[i]! - expectedScores[i]!))
    )
  }

  getActualScores(n: number, _resultOrder?: number[]): number[] {
    const resultOrder = _resultOrder || Array.from({ length: n }, (_, i) => i)
    let scores = this.scoreFunc(n)

    scores = argsort(argsort(resultOrder)).map((i) => scores[i]!)

    const distinctResults = new Set(resultOrder)
    if (distinctResults.size !== n) {
      distinctResults.forEach((place) => {
        const idx = resultOrder.flatMap((x, i) => (x === place ? i : []))
        const meanScore = mean(idx.map((i) => scores[i]!))
        idx.forEach((i) => {
          scores[i] = meanScore
        })
      })
    }

    this.validateActualScores(scores, resultOrder)
    return scores
  }

  validateActualScores(scores: number[], resultOrder: number[]): void {
    if (sum(scores).toFixed(2) !== "1.00") {
      throw new Error("scoring function does not return scores summing to 1")
    }
    if (Math.min(...scores) !== 0) {
      const lastPlace = Math.max(...resultOrder)
      if (resultOrder.filter((x) => x === lastPlace).length === 1) {
        throw new Error("scoring function does not return minimum value of 0")
      }
    }
    if (
      !argsort(resultOrder)
        .map((i) => scores[i]!)
        .every((val, i, arr) => !i || val <= arr[i - 1]!)
    ) {
      throw new Error("scoring function does not return monotonically decreasing values")
    }
  }

  getExpectedScores(ratings: number[]): number[] {
    const n = ratings.length
    const diffMx = matrix(ratings).map((value, index, matrix) => {
      return matrix.map((innerValue) => value - innerValue)
    })
    const logisticMx = diffMx.map((value) => 1 / (1 + exp(value / this.d)))
    for (let i = 0; i < n; i++) {
      logisticMx.subset(index(i, i), 0)
    }

    const expectedScores = transpose(logisticMx)
      .toArray()
      .map((row) => sum([row].flat())) as number[]
    const denom = (n * (n - 1)) / 2
    return expectedScores.map((score) => score / denom)
  }
}

function linearScoreFunction(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i + 1).map((p) => (n - p) / ((n * (n - 1)) / 2))
}

function createExponentialScoreFunction(base: number): (n: number) => number[] {
  if (base === 1) {
    return linearScoreFunction
  }
  return (n: number) => {
    const scores = Array.from({ length: n }, (_, i) => i + 1).map((p) => base ** (n - p) - 1)
    return divide(scores, sum(scores)) as number[]
  }
}

function argsort(arr: number[]): number[] {
  return arr
    .map((value, index) => [value, index] as const)
    .sort()
    .map((pair) => pair[1])
}

export const elo = new MultiElo({})

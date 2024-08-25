import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { getGameStateWithQuestion, getSessionInfoForPlayer } from "~/lib/games/queries"
import { createTRPCRouter, protectedProcedure } from "~/lib/trpc/trpc"

export const gameRouter = createTRPCRouter({
  getPlayerGameSession: protectedProcedure
    .input(
      z.object({
        game_id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const sessionInfo = await getSessionInfoForPlayer(ctx.db, ctx.user.id, input.game_id)
      if (!sessionInfo) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Game not found" })
      }
      return sessionInfo
    }),

  getGameStateWithQuestion: protectedProcedure
    .input(
      z.object({
        game_id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const gameState = await getGameStateWithQuestion(ctx.db, input.game_id)
      if (!gameState) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Game not found" })
      }
      return gameState
    }),
})

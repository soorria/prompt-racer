import { z } from "zod"
import { getSessionInfoForPlayer } from "../games/queries"
import { createCallerFactory, createTRPCRouter, protectedProcedure, publicProcedure } from "./trpc"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  demo: publicProcedure.query(() => "yo"),
  gameSessionInfo: protectedProcedure.input(z.object({
    game_id: z.string()
  })).query(async ({ ctx, input }) => {
    const sessionInfo = await getSessionInfoForPlayer(ctx.db, ctx.user.id, input.game_id)
    if (!sessionInfo) {
      throw new Error("Game not found")
    }
    return sessionInfo
  }),
})

// export type definition of API
export type AppRouter = typeof appRouter

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter)

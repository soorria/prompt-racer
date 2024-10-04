import { cmp, schema } from "../db"
import { createTRPCRouter, protectedProcedure } from "../trpc/trpc"

export const authRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.userProfiles.findFirst({
      where: cmp.eq(schema.userProfiles.id, ctx.user.id),
    })
  }),
})

import { cmp, schema } from "../db"
import { createTRPCRouter, protectedProcedure } from "../trpc/trpc"


export const authRouter = createTRPCRouter({
  getUser: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.query.users.findFirst({
        where: cmp.eq(schema.users.id, ctx.user.id),
      })
    }),
})


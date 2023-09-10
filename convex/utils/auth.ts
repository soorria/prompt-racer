import { UserIdentity } from "convex/server"
import { ActionCtx, MutationCtx, QueryCtx } from "../_generated/server"

export const getUserId = (identity: UserIdentity) => identity.tokenIdentifier

export const requireUser = async (ctx: QueryCtx | ActionCtx | MutationCtx) => {
  const identity = await ctx.auth.getUserIdentity()

  if (!identity) {
    throw new Error("Not logged in")
  }

  return {
    userId: getUserId(identity),
    identity,
  }
}

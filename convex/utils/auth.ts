import { UserIdentity } from "convex/server"
import { AnyCtx } from "./types"
import { ConvexError } from "convex/values"

export const getUserId = (identity: UserIdentity) => identity.tokenIdentifier

export const requireUser = async (ctx: AnyCtx) => {
  const user = await getUser(ctx)

  if (!user) {
    throw new ConvexError("Not logged in")
  }

  return user
}

export const getUser = async (ctx: AnyCtx) => {
  const identity = await ctx.auth.getUserIdentity()

  if (!identity) {
    return null
  }

  return {
    userId: getUserId(identity),
    identity,
  }
}

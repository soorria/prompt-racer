import { UserIdentity } from "convex/server"

export const getUserId = (identity: UserIdentity) => identity.tokenIdentifier

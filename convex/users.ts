import { query } from "./_generated/server"
import { getUser } from "./utils/auth"

export const getCurrentUser = query({
  handler: async (ctx) => {
    const user = await getUser(ctx)

    return user
  },
})

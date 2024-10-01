import { type User } from "@supabase/supabase-js"

const SOORRIA_EMAIL = "soorria.ss@gmail.com"
export const IGNORE_EVENTS_USERS_EMAILS = [SOORRIA_EMAIL, "ericcpaul00@gmail.com"]

export function isSoorria(user: User | null | undefined) {
  return user?.email === SOORRIA_EMAIL
}

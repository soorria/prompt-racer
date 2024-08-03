import { redirect } from "next/navigation"

import { logoutAction } from "~/lib/auth/actions"

export async function GET() {
  await logoutAction()
  redirect("/")
}

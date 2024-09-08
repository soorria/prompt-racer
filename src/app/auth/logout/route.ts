import { redirect } from "next/navigation"

import { logoutAction } from "~/lib/auth/actions"

export const dynamic = "force-dynamic"

export async function GET() {
  await logoutAction()
  redirect("/")
}

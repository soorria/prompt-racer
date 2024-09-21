import type { MiddlewareConfig, NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { updateSupabaseSessionInMiddleware } from "~/lib/supabase/middleware"

const publicRoutes = ["/auth/login", "/auth/callback", "/", /^\/leaderboard(\/[^/]*)?$/, '/api/inngest', /^\/games\/results\/.*/]

export async function middleware(request: NextRequest) {
  if (
    publicRoutes.some((route) => {
      if (typeof route === "string") {
        return request.nextUrl.pathname === route
      }
      return route.test(request.nextUrl.pathname)
    })
  ) {
    return NextResponse.next()
  }
  return await updateSupabaseSessionInMiddleware(request)
}

export const config: MiddlewareConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

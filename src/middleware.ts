import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  // debug: true,
})

export const config = {
  matcher: ["/g/(.*)"],
}

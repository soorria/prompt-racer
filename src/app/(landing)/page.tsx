import Link from "next/link"

import HeroAnimation from "~/components/landing-page/HeroAnimation"
import PatternBlobBackground from "~/components/landing-page/PatternBlobBackground"
import { getAuthUser } from "~/lib/auth/user"

export default async function Home() {
  const user = await getAuthUser()
  return (
    <div className="sm:mt-40">
      <PatternBlobBackground />
      <div className="isolate overflow-hidden">
        <div className="mx-auto mb-16 max-w-7xl items-center px-6 lg:flex lg:px-8">
          <div className="mx-auto max-w-2xl flex-shrink-0 pr-12 lg:mx-0 lg:max-w-xl lg:pt-8">
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl">
              AI Powered Coding Battles
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Put your AI prompting skills to the test in a game of speed and intelligence.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                href={user ? "/game" : "/auth/login"}
                className={
                  "inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                }
              >
                Play Now
              </Link>
            </div>
          </div>
          <div className="mx-auto mt-16 flex flex-1 sm:mt-24 lg:mr-0 lg:mt-12">
            <div className="mx-auto w-full max-w-lg flex-none">
              <HeroAnimation />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

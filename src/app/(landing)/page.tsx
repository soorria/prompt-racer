import HeroAnimation from "~/components/landing-page/HeroAnimation"
import PatternBlobBackground from "~/components/landing-page/PatternBlobBackground"
import { Button } from "~/components/ui/button"

export default function Home() {
  return (
    <div className="h-full">
      <PatternBlobBackground />
      <div className="isolate overflow-hidden md:mt-40">
        <div className="mx-auto mb-16 max-w-7xl items-center px-6 lg:flex lg:px-8">
          <div className="mx-auto max-w-2xl flex-shrink-0 pr-12 lg:mx-0 lg:max-w-xl lg:pt-8">
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl">
              AI Powered Coding Battles
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Put your AI prompting skills to the test in a game of speed and intelligence.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Button>Play Now</Button>
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

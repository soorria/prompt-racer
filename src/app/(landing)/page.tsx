import FinishGameScreen from "~/components/FinishGameScreen"
import HeroAnimation from "~/components/HeroAnimation"
import PlayNowButton from "~/components/PlayNowButton"

export default function Home() {
  return (
    <div className="h-full">
      <div className="isolate overflow-hidden">
        <div
          className="absolute left-[calc(50%-4rem)] top-10 -z-50 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"
          aria-hidden="true"
        >
          <div
            className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#80caff] to-primary opacity-20"
            style={{
              clipPath:
                "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
            }}
          />
        </div>
        <div className="mx-auto max-w-7xl items-center px-6  pt-10 lg:flex lg:px-8">
          <div className="mx-auto pr-12 max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl">
              AI Powered Coding Battles
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Put your AI prompting skills to the test in a game of speed and intelligent.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <PlayNowButton />
            </div>
          </div>
          <div className="mt-16 mx-auto flex-1 flex w-full max-w-2xl sm:mt-24 lg:mr-0 lg:mt-12 lg:max-w-none">
            <div className="max-w-3xl w-full flex-none sm:max-w-5xl lg:max-w-none mx-auto">
              <HeroAnimation />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

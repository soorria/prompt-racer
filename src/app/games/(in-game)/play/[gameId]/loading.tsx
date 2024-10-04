import { LayoutTemplate } from "lucide-react"

import { Skeleton } from "~/components/ui/skeleton"

export default function GameLoadingPage() {
  return (
    <>
      <Skeleton className="mb-3 h-8 rounded-t-none sm:h-16"></Skeleton>
      <Skeleton className="grid h-full flex-1 place-items-center">
        <LayoutTemplate className="sq-72 animate-bounce text-white/10" />
      </Skeleton>
    </>
  )
}

export function GameLayoutLoadingPage() {
  return (
    <>
      <Skeleton className="grid h-full flex-1 place-items-center">
        <LayoutTemplate className="sq-72 animate-bounce text-white/10" />
      </Skeleton>
    </>
  )
}

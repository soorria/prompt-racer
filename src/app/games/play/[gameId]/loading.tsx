import { LayoutTemplate } from "lucide-react"

import { Skeleton } from "~/components/ui/skeleton"

export default function GameLoadingPage() {
  return (
    <Skeleton className="grid h-full place-items-center">
      <LayoutTemplate className="h-72 w-72 animate-bounce text-white/10" />
    </Skeleton>
  )
}

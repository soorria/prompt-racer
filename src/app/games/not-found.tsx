import Link from "next/link"

import { Button } from "~/components/ui/button"

export default function GameNotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center bg-background px-4 py-12 dark:bg-muted sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto h-12 w-12 text-green-500" />
        <h1 className="mt-4 text-8xl font-bold tracking-tight text-foreground sm:text-9xl">404</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Oops, the requested game was not found.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/games/join">Back to home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

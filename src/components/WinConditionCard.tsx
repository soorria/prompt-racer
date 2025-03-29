import { type GameModeDetailsItem } from "~/lib/games/constants"
import { cn } from "~/lib/utils"

export const WinConditionCard = ({ mode }: { mode: GameModeDetailsItem }) => {
  return (
    <div
      className={cn(
        "relative my-4 flex w-full max-w-prose flex-col overflow-hidden rounded-2xl p-3 @container",
      )}
      style={{
        backgroundColor: mode.color,
        boxShadow: "inset 0 0 0 1000px rgba(0,0,0,0.7)",
      }}
    >
      <div className="absolute right-3 top-3 hidden rounded-full bg-black/30 px-2 py-0.5 text-xs font-medium @[200px]:block">
        Win condition
      </div>

      <div className="mb-2 flex items-center gap-2">
        <mode.icon className="hidden h-4 w-4 @sm:block" />
        <h2 className="@sm:text-md text-sm font-medium">{mode.title}</h2>
      </div>
      <p className="text-sm">{mode.description}</p>
    </div>
  )
}

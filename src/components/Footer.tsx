"use client"

import { Fragment } from "react"

import { cn } from "~/lib/utils"
import { useMounted } from "~/lib/utils/use-mounted"

const creators: { name: string; link: string; hoverColorClass: string }[] = [
  {
    name: "Soorria",
    link: "https://soorria.com",
    hoverColorClass: "hover:text-[#bd93f9]",
  },
  { name: "Eric", link: "https://ericpullukaran.com/", hoverColorClass: "hover:text-orange-400" },
]

export function Footer() {
  const mounted = useMounted()
  const creatorsInOrder = !mounted || Math.random() > 0.5 ? creators : [...creators].reverse()

  return (
    <footer className="flex flex-col items-center justify-center gap-1 p-2 text-xs text-muted-foreground sm:flex-row">
      <span>
        Made with ❤️ by{" "}
        {creatorsInOrder.map((creator, i) => (
          <Fragment key={creator.link}>
            <a
              href={`${creator.link}?ref=prompt-racer`}
              target="_blank"
              className={cn("underline transition", creator.hoverColorClass)}
            >
              {creator.name}
            </a>
            {i === 0 ? <span> and </span> : i === creators.length - 1 ? "" : ", "}
          </Fragment>
        ))}
      </span>
    </footer>
  )
}

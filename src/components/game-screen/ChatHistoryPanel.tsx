import { useEffect, useRef } from "react"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import clsx from "clsx"
import { Bot, ChevronsDown } from "lucide-react"

import { type Doc } from "~/lib/db/types"
import CodeRenderer from "../CodeRenderer"
import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"
import { useGameManager } from "./GameManagerProvider"

type MessageType = Doc<"playerGameSessionChatHistoryItems">

function ChatPanelMessage({
  message,
  index,
  len,
}: {
  index: number
  len: number
  message: MessageType
}) {
  const contentRef = useRef<HTMLDivElement>(null)

  const aiMessageParsed = message.content.type === "ai" ? message.content.parsedCompletion : null
  const generating = aiMessageParsed?.state === "generating"
  const previousGenerating = useRef<boolean>(false)

  useEffect(() => {
    if (generating || (previousGenerating.current && !generating)) {
      // contentRef.current?.scrollIntoView()
    }
    previousGenerating.current = generating
  }, [generating])

  return (
    <li className="relative flex gap-x-4">
      <div
        className={clsx(
          "absolute left-0 top-0 flex w-6 justify-center",
          index === len - 1 ? "h-6" : "-bottom-6",
          { "-bottom-6 top-12": index === 0 },
        )}
      >
        <div className="w-0.5 bg-gray-400" />
      </div>
      {message.content.type === "ai" && (
        <>
          <div className="z-10 grid h-6 w-6 flex-none place-content-center rounded-full bg-card ring-1 ring-zinc-400">
            <Bot className="h-4 w-4" />
          </div>
          <div ref={contentRef} className={clsx("overflow-auto rounded-xl bg-dracula text-xs")}>
            <CodeRenderer code={message.content.rawCompletion} language="python" />
          </div>
        </>
      )}
      {message.content.type === "instructions" && (
        <>
          <div className="relative mt-9 flex h-6 w-6 flex-none items-center justify-center">
            <div className="h-1.5 w-1.5 rounded-full bg-card ring-1 ring-gray-300" />
          </div>
          <p className="mt-8 w-full flex-auto rounded-lg bg-primary px-3 py-2 text-xs leading-5 text-primary-foreground">
            {message.content.instructions}
          </p>
        </>
      )}
      {message.content.type === "reset" && (
        <>
          <div className="relative mt-9 flex h-6 w-6 flex-none items-center justify-center">
            <div className="h-1.5 w-1.5 rounded-full bg-card ring-1 ring-gray-300" />
          </div>
          <p className="mt-8 flex w-full flex-auto justify-center rounded-lg px-3 py-2 text-xs leading-5 text-zinc-500">
            code reset
          </p>
        </>
      )}
    </li>
  )
}

export default function ChatHistoryPanel() {
  const context = useGameManager()
  const chatMessages = context.gameSessionInfo.chatHistory

  const messagesEndRef = useRef<null | HTMLDivElement>(null)
  const [animateRef] = useAutoAnimate()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // scroll to the bottom automatically when a new message is added
  // useEffect(() => {
  //   scrollToBottom()
  // }, [props.messages])
  if (!chatMessages) {
    return <Skeleton className="h-full" />
  }

  const messageTmp = [...chatMessages]

  return (
    <div className="relative h-full overflow-auto scroll-smooth rounded-xl border-2 border-white/5 bg-card">
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-zinc-900 px-3 py-2 text-white">
        <p className="font-medium">Change Log</p>
        <Button variant={"outline"} size="icon" onClick={scrollToBottom}>
          <ChevronsDown className="h-4 w-4" />
        </Button>
      </div>

      <ul ref={animateRef} role="list" className="space-y-6 px-3 pb-8">
        {messageTmp.map((message, idx) => (
          <ChatPanelMessage
            key={message.id}
            index={idx}
            message={message}
            len={messageTmp.length}
          />
        ))}
        <div ref={messagesEndRef}></div>
      </ul>
    </div>
  )
}

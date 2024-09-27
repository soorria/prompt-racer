import { useEffect, useRef } from "react"
import { invariant } from "@epic-web/invariant"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import clsx from "clsx"
import { Bot } from "lucide-react"

import { type Doc } from "~/lib/db/types"
import { cn } from "~/lib/utils"
import CodeRenderer from "../CodeRenderer"
import { Skeleton } from "../ui/skeleton"
import { useGameManager } from "./GameManagerProvider"

type MessageType = Doc<"playerGameSessionChatHistoryItems">

export const ChatHistoryPanelImpl = {
  key: "chat",
  className: "bg-card",
  component: <ChatHistoryPanel />,
}

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
        className={cn(
          "absolute -bottom-8 left-0 top-0 flex w-6 justify-center",
          { "top-4": index === 0 },
          { "bottom-auto": index === len - 1 },
        )}
      >
        <div className="w-0.5 bg-gray-400" />
      </div>
      {message.content.type === "ai" && (
        <>
          <div className="sq-6 z-10 mb-8 grid flex-none place-content-center rounded-full bg-card ring-1 ring-zinc-400">
            <Bot className="sq-4" />
          </div>
          <div
            ref={contentRef}
            className={clsx("mb-8 overflow-auto rounded-xl bg-dracula text-xs")}
          >
            <CodeRenderer
              code={
                message.content.parsedCompletion.state === "error"
                  ? "TODO: handle error"
                  : message.content.parsedCompletion.maybeCode
              }
              language="python"
            />
          </div>
        </>
      )}
      {message.content.type === "instructions" && (
        <>
          <div className="sq-6 relative flex flex-none items-center justify-center">
            <div className="h-1.5 w-1.5 rounded-full bg-card ring-1 ring-gray-300" />
          </div>
          <p className="mt-1 w-full flex-auto rounded-lg bg-zinc-600 px-3 py-2 text-xs leading-5 text-card-foreground">
            {message.content.instructions}
          </p>
        </>
      )}
      {message.content.type === "reset" && (
        <>
          <div className="sq-6 relative mt-9 flex flex-none items-center justify-center">
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

  if (!chatMessages) {
    return <Skeleton className="h-full" />
  }

  const swapAIAndInstructions = (messages: MessageType[]) => {
    const swappedMessages = []

    for (let i = 0; i < messages.length; i++) {
      const currentMessage = messages[i]
      invariant(currentMessage, "currentMessage is undefined")
      const nextMessage = messages[i + 1]

      if (
        currentMessage.content.type === "ai" &&
        nextMessage &&
        nextMessage.content.type === "instructions"
      ) {
        swappedMessages.push(nextMessage)
        swappedMessages.push(currentMessage)
        i++
      } else {
        swappedMessages.push(currentMessage)
      }
    }

    return swappedMessages
  }

  const sortedMessages = swapAIAndInstructions([...chatMessages].reverse())

  return (
    <div className="relative h-full overflow-auto scroll-smooth rounded-xl bg-card">
      {/* <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-zinc-900 px-3 py-2 text-white">
        <p className="font-medium">Change Log</p>
        <Button variant={"outline"} size="icon" onClick={scrollToBottom}>
          <ChevronsDown className="sq-4" />
        </Button>
      </div> */}

      <ul ref={animateRef} role="list" className="space-y-6 px-3 pt-8">
        {sortedMessages.map((message, idx) => {
          return (
            <ChatPanelMessage key={idx} index={idx} message={message} len={sortedMessages.length} />
          )
        })}
        <div ref={messagesEndRef}></div>
      </ul>
    </div>
  )
}

import { useEffect, useRef } from "react"
import { Bot, ChevronsDown, Loader } from "lucide-react"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { Doc } from "~convex/dataModel"
import clsx from "clsx"
import CodeDisplay from "./CodeDisplay"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Button } from "./ui/button"

export type ChatPanelProps = {
  messages: Doc<"playerGameInfo">["chatHistory"]
  onMessageSend: (message: string) => void
  sending?: boolean
}

type MessageType = ChatPanelProps["messages"][number]

export function ChatPanelMessageCode(props: { code: string; generating?: boolean }) {
  return (
    <CodeDisplay
      code={props.code}
      language="python"
      preProps={{
        className: clsx({ "opacity-50": props.generating }),
      }}
    />
  )
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
  const [animateRef] = useAutoAnimate()

  const aiMessageParsed = message.role === "ai" ? message.parsed : null
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
          "absolute left-0 flex w-6 justify-center top-0",
          index === len - 1 ? "h-6" : "-bottom-6",
          { "h-8 top-auto": index === 0 }
        )}
      >
        <div className="w-0.5 bg-gray-400" />
      </div>
      {message.role === "ai" ? (
        <>
          <Avatar className="h-6 w-6 flex-none rounded-full ring-1 ring-zinc-400">
            <AvatarFallback>
              {message.parsed.state === "generating" ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </AvatarFallback>
          </Avatar>
          <div
            key={message.parsed.state}
            ref={contentRef}
            className={clsx("text-xs overflow-auto bg-dracula ml-0.5 rounded-xl", {
              "-mx-3": message.parsed.state === "success",
            })}
          >
            {message.parsed.state === "generating" ? (
              <ChatPanelMessageCode code={message.parsed.maybeCode} generating />
            ) : message.parsed.state === "success" ? (
              <ChatPanelMessageCode code={message.parsed.code} />
            ) : message.parsed.state === "error" ? (
              message.parsed.error
            ) : null}
          </div>
        </>
      ) : (
        <>
          <div className="relative flex h-6 w-6 flex-none items-center justify-center mt-8">
            <div className="h-1.5 w-1.5 rounded-full ring-1 ring-gray-300 bg-card" />
          </div>
          <p className="flex-auto py-0.5 text-xs leading-5 text-zinc-300 mt-8">
            <span className="font-medium bg-primary p-2 text-black rounded-lg">
              {message.content}
            </span>
          </p>
        </>
      )}
    </li>
  )
}

export default function ChatPanel(props: ChatPanelProps) {
  const messagesEndRef = useRef<null | HTMLDivElement>(null)
  const [animateRef] = useAutoAnimate()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // scroll to the bottom automatically when a new message is added
  // useEffect(() => {
  //   scrollToBottom()
  // }, [props.messages])

  return (
    <div className="bg-card h-full overflow-scroll rounded-xl border-2 border-white/5 relative scroll-smooth">
      <div className="bg-zinc-900 p-4 text-white font-bold border-b border-white/10 flex justify-between items-center">
        Change Log
        <Button variant={"outline"} onClick={scrollToBottom}>
          <ChevronsDown className="w-6 h-6" />
        </Button>
      </div>

      <ul ref={animateRef} role="list" className="space-y-6 px-3 pb-8">
        {props.messages.map((message, idx) => (
          <ChatPanelMessage key={idx} index={idx} message={message} len={props.messages.length} />
        ))}
        <div ref={messagesEndRef}></div>
      </ul>
    </div>
  )
}

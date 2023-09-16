import { useEffect, useRef } from "react"
import { ChatbotToggle } from "./ChatbotToggle"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Send } from "lucide-react"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { Doc } from "~convex/dataModel"
import clsx from "clsx"

type ChatPanelProps = {
  messages: Doc<"playerGameInfo">["chatHistory"]
  onMessageSend: (message: string) => void
  sending?: boolean
}

type MessageType = ChatPanelProps["messages"][number]

function ChatPanelMessage({ message }: { message: MessageType }) {
  const contentRef = useRef<HTMLPreElement>(null)
  const [animateRef] = useAutoAnimate()

  const aiMessageParsed = message.role === "ai" ? message.parsed : null
  const generating = aiMessageParsed?.state === "generating"
  const previousGenerating = useRef<boolean>(false)

  useEffect(() => {
    if (generating || (previousGenerating.current && !generating)) {
      contentRef.current?.scrollIntoView()
    }
    previousGenerating.current = generating
  }, [generating])

  return (
    <div
      className={clsx(
        "flex max-w-xs w-full flex-col gap-2 rounded-lg px-3 py-2 text-sm break-words transition",
        {
          "ml-auto bg-primary text-primary-foreground": message.role !== "ai",
        },
        message.role === "ai" && {
          "text-foreground/50": message.parsed.state === "generating",
          "text-foreground": message.parsed.state === "success",
          "text-destructive-foreground bg-destructive": message.parsed.state === "error",
          "bg-muted": message.parsed.state !== "error",
        }
      )}
      ref={animateRef}
    >
      {message.role === "ai" ? (
        <pre key={message.parsed.state} ref={contentRef}>
          {message.parsed.state === "generating"
            ? message.content.replace("<code>", "").replace("</code>", "")
            : message.parsed.state === "success"
            ? message.parsed.code
            : message.parsed.state === "error"
            ? message.parsed.error
            : null}
        </pre>
      ) : (
        message.content
      )}
    </div>
  )
}

export default function ChatPanel(props: ChatPanelProps) {
  const form = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!props.sending) {
      form.current?.reset()
    }
  }, [props.sending])

  return (
    <div className="h-full overflow-scroll relative scroll-smooth">
      <div className="bg-card rounded-xl px-3 overflow-x-hidden flex flex-col-reverse scroll-smooth">
        <div className="flex flex-col flex-grow gap-4 py-4">
          {props.messages.map((message, idx) => (
            <ChatPanelMessage key={idx} message={message} />
          ))}
        </div>
      </div>

      <div className="sticky bottom-0 rounded-b-xl left-0 right-0 bg-gradient-to-b to-black/20 from-transparent">
        <div className="flex px-2 py-4">
          <form
            ref={form}
            className="flex w-full items-center space-x-2"
            onSubmit={(event) => {
              event.preventDefault()
              const message = new FormData(event.currentTarget).get("message")
              if (typeof message === "string" && message) {
                props.onMessageSend(message)
              }
            }}
          >
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
              id="message"
              name="message"
              placeholder="Type your instructions..."
              autoComplete="off"
              required
              disabled={props.sending}
            />
            <button
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-10"
              type="submit"
              disabled={props.sending}
            >
              <Send className="w-5 h-5" />
              <span className="sr-only">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

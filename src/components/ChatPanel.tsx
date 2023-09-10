import React from "react"
import { ChatbotToggle } from "./ChatbotToggle"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Send } from "lucide-react"

type Props = {}

type MessageType = {
  id: number
  text: string
  sender: "user" | "bot"
}

const messages: MessageType[] = [
  {
    id: 1,
    text: "Hi, how can I help you today?",
    sender: "bot",
  },
  {
    id: 2,
    text: "Hey, I'm having trouble with my account.",
    sender: "user",
  },
  {
    id: 3,
    text: "What seems to be the problem?",
    sender: "bot",
  },
  {
    id: 4,
    text: "I can't log in.",
    sender: "user",
  },
  {
    id: 3,
    text: "What seems to be the problem?",
    sender: "bot",
  },
  {
    id: 4,
    text: "I can't log in.",
    sender: "user",
  },
  {
    id: 3,
    text: "What seems to be the problem?",
    sender: "bot",
  },
  {
    id: 4,
    text: "I can't log in.",
    sender: "user",
  },
  {
    id: 3,
    text: "What seems to be the problem?",
    sender: "bot",
  },
  {
    id: 4,
    text: "I can't log in.",
    sender: "user",
  },
  {
    id: 3,
    text: "What seems to be the problem?",
    sender: "bot",
  },
  {
    id: 4,
    text: "I can't log in.",
    sender: "user",
  },
]

export default function ChatPanel({}: Props) {
  return (
    <div className="bg-card h-full rounded-xl px-3 overflow-scroll">
      <div className="absolute top-0 left-2 right-2 mb-4">
        <ChatbotToggle />
      </div>
      <div className="space-y-4 y-full mt-24 mb-20">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex w-max flex-col gap-2 rounded-lg px-3 py-2 text-sm ${
              message.sender === "bot" ? "bg-muted" : "ml-auto bg-primary text-primary-foreground"
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="absolute -bottom-4 rounded-b-xl left-0 right-0 mb-4 bg-gradient-to-b to-black/20 from-transparent">
        <div className="flex px-2 py-4">
          <form className="flex w-full items-center space-x-2">
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
              id="message"
              placeholder="Type your message..."
              autoComplete="off"
              value=""
            />
            <button
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-10"
              type="submit"
              disabled={false}
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

"use client"

import { Button } from "~/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useRef, useState } from "react"
import { ChevronDown } from "lucide-react"

const openAI3 = {
  avatarImage: "http://localhost:3000/chatbot-avatars/chatGPTAvatar.webp",
  avatarFallback: "AI",
  title: "OpenAI",
  description: "gpt-3.5-turbo",
}

const openAI4 = {
  avatarImage: "http://localhost:3000/chatbot-avatars/openAIBlue.webp",
  avatarFallback: "AI",
  title: "OpenAI",
  description: "gpt-4-chat",
}

const googlePalm = {
  avatarImage: "http://localhost:3000/chatbot-avatars/googlePalmAvatar.webp",
  avatarFallback: "AI",
  title: "Google PaLM",
  description: "text-bison-002",
}
const components = [openAI3, openAI4, googlePalm]
export function ChatbotToggle() {
  const [currentBot, setCurrentBot] = useState(openAI3)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const menuSize = useRef(null)

  const handleBotClick = (bot: any) => {
    setCurrentBot(bot)
    setIsPopoverOpen(false)
  }

  return (
    <Popover open={isPopoverOpen} onClose={() => setIsPopoverOpen(false)}>
      <PopoverTrigger asChild>
        <Button
          ref={menuSize}
          variant="outline"
          className="w-full h-16 justify-start mt-3 rounded-xl bg-zinc-950"
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
        >
          <div className="flex justify-between w-full items-center">
            <Avatar className="shrink-0">
              <AvatarImage src={currentBot.avatarImage} alt="@shadcn" />
              <AvatarFallback>{currentBot.avatarFallback}</AvatarFallback>
            </Avatar>
            <div className="ml-3 shrink-0 flex flex-col items-start justify-start">
              <div>{currentBot.title}</div>
              <div className="text-zinc-500">{currentBot.description}</div>
            </div>
            <div className="flex-1 flex justify-end">
              <ChevronDown
                className="relative top-[1px] ml-1 h-4 w-4 transition duration-200 group-data-[state=open]:rotate-180"
                aria-hidden="true"
              />
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`w-80`}>
        <div className="grid">
          {components.map((bot, idx) => (
            <div
              key={idx}
              className="hover:bg-white/5 transition ease-in-out p-3 rounded-xl cursor-pointer"
              onClick={() => handleBotClick(bot)}
            >
              <div className="flex items-center">
                <Avatar>
                  <AvatarImage src={bot.avatarImage} alt="@shadcn" />
                  <AvatarFallback>{bot.avatarFallback}</AvatarFallback>
                </Avatar>
                <div className="ml-3 flex-1 flex flex-col items-start justify-start">
                  <div>{bot.title}</div>
                  <div className="text-zinc-500">{bot.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

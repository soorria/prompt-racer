"use client"

import React from "react"
import { Terminal } from "lucide-react"

import type { Doc } from "~/lib/db/types"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip"
import { ChatHistoryView } from "../game-screen/ChatHistoryPanel"
import { Button } from "../ui/button"
import ResponsiveDialog from "../ui/ResponsiveDialog"

export default function FinalSubmittedCodeDialog({
  chatHistory,
}: {
  chatHistory: Doc<"playerGameSessionChatHistoryItems">[]
}) {
  return (
    <>
      <ResponsiveDialog
        title="Chat history"
        renderTrigger={(props) => (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="h-fit p-1"
                onClick={props.openDialog}
                Icon={() => <Terminal className="mr-0 sq-4" />}
                variant={"outline"}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Submitted code</p>
            </TooltipContent>
          </Tooltip>
        )}
        renderContent={() => (
          <div className="flex max-h-96 flex-col gap-2 overflow-auto rounded-xl bg-card no-scrollbar">
            <ChatHistoryView chatMessages={chatHistory} />
          </div>
        )}
      />
    </>
  )
}

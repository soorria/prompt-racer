"use client"

import React from "react"
import { Terminal } from "lucide-react"

import CodeRenderer from "../CodeRenderer"
import { Button } from "../ui/button"
import ResponsiveDialog from "../ui/ResponsiveDialog"

export default function FinalSubmittedCodeDialog({ code }: { code: string }) {
  return (
    <>
      <ResponsiveDialog
        title="Submitted code"
        renderTrigger={(props) => (
          <Button
            className="h-fit p-1"
            onClick={props.openDialog}
            Icon={() => <Terminal className="mr-0 sq-4" />}
            variant={"outline"}
          />
        )}
        renderContent={() => (
          <div className="flex flex-col gap-2 overflow-auto rounded-xl bg-dracula">
            <CodeRenderer code={code} language="python" />
          </div>
        )}
      />
    </>
  )
}

"use client"

import React, { useState } from "react"
import { useMediaQuery } from "@react-hook/media-query"

import { MOBILE_VIEWPORT } from "../game-screen/InProgressGame"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./dialog"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "./drawer"

type InternalResponsiveDialogProps = {
  isOpen: boolean
  openDialog: () => void
  closeDialog: () => void
  title: string
  description?: string
  onClose?: (dismiss?: boolean) => void
}

type CoreResponsiveDialogProps = {
  title: string
  isOpen?: boolean
  description?: string
  onClose?: (dismiss?: boolean) => void
}

type ResponsiveDialogProps = {
  renderTrigger?: React.FC<InternalResponsiveDialogProps>
  renderContent: React.FC<InternalResponsiveDialogProps>
} & CoreResponsiveDialogProps

const ResponsiveDialog = (props: ResponsiveDialogProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false)

  const isOpen = props.isOpen ?? internalIsOpen

  const openDialog = () => setInternalIsOpen(true)
  const closeDialog = (dismiss?: boolean) => {
    props.onClose?.(dismiss)
    setInternalIsOpen(false)
  }

  return (
    <>
      {props.renderTrigger?.({ ...props, isOpen, openDialog, closeDialog })}
      {isOpen && (
        <ResponsiveDialogCore
          title={props.title}
          description={props.description}
          isOpen={isOpen}
          closeDialog={closeDialog}
          content={props.renderContent({
            ...props,
            isOpen,
            openDialog,
            closeDialog,
          })}
        />
      )}
    </>
  )
}

type ResponsiveDialogCoreProps = {
  isOpen: boolean
  closeDialog: (dismiss?: boolean) => void
  title: string
  description?: string
  content: React.ReactNode | undefined
}

const ResponsiveDialogCore = ({
  isOpen,
  closeDialog,
  title,
  description,
  content,
}: ResponsiveDialogCoreProps) => {
  const isMobile = useMediaQuery(MOBILE_VIEWPORT)

  return isMobile ? (
    <Drawer
      open={isOpen}
      noBodyStyles={true}
      preventScrollRestoration={false}
      onClose={() => closeDialog(true)}
    >
      <DrawerContent>
        <DrawerHeader className="text-center">
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <div className="p-6">{content}</div>
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen}>
      <DialogContent onClose={() => closeDialog(true)} className="rounded-lg">
        <DialogHeader className="text-left">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  )
}

export default ResponsiveDialog

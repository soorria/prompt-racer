"use client"

import * as React from "react"
import { useMediaQuery } from "@react-hook/media-query"

import { cn } from "~/lib/utils"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "./drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu"

type ResponsiveDropdownMenuTriggerProps = {
  className?: string
  children: React.ReactNode
}

const ResponsiveDropdownMenuTrigger = ({
  className,
  children,
}: ResponsiveDropdownMenuTriggerProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)")

  if (isMobile) {
    return <DrawerTrigger className={className}>{children}</DrawerTrigger>
  }

  return <DropdownMenuTrigger className={className}>{children}</DropdownMenuTrigger>
}
ResponsiveDropdownMenuTrigger.displayName = "ResponsiveDropdownMenuTrigger"

type ResponsiveDropdownMenuContentProps = {
  className?: string
  children: React.ReactNode
  align?: "start" | "center" | "end"
}

const ResponsiveDropdownMenuContent = ({
  className,
  children,
  align,
}: ResponsiveDropdownMenuContentProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)")

  if (isMobile) {
    return (
      <DrawerContent className={className}>
        <DrawerHeader>
          <DrawerTitle className="mb-2 text-left">Options</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">{children}</div>
      </DrawerContent>
    )
  }

  return (
    <DropdownMenuContent className={className} align={align}>
      {children}
    </DropdownMenuContent>
  )
}
ResponsiveDropdownMenuContent.displayName = "ResponsiveDropdownMenuContent"

type ResponsiveDropdownMenuGroupProps = {
  className?: string
  children: React.ReactNode
}

const ResponsiveDropdownMenuGroup = ({ className, children }: ResponsiveDropdownMenuGroupProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)")

  if (isMobile) {
    return <div className={cn(className, "flex flex-col gap-3")}>{children}</div>
  }

  return <DropdownMenuGroup className={className}>{children}</DropdownMenuGroup>
}
ResponsiveDropdownMenuGroup.displayName = "ResponsiveDropdownMenuGroup"

type ResponsiveDropdownMenuItemProps = {
  className?: string
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  asChild?: boolean
}

const ResponsiveDropdownMenuItem = ({
  className,
  children,
  onClick,
  disabled,
  asChild,
}: ResponsiveDropdownMenuItemProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)")

  if (isMobile) {
    const commonStyles =
      "flex w-full cursor-pointer items-center gap-2 rounded-2xl bg-white/10 p-4 text-sm font-semibold outline-none transition-colors hover:bg-accent focus:bg-accent"
    if (asChild) {
      const child = React.Children.only(children) as React.ReactElement
      return React.cloneElement(child, {
        className: cn(commonStyles, className),
        onClick: disabled ? undefined : onClick,
      })
    }

    return (
      <div className={cn(commonStyles, className)} onClick={disabled ? undefined : onClick}>
        {children}
      </div>
    )
  }

  return (
    <DropdownMenuItem className={className} onClick={onClick} disabled={disabled} asChild={asChild}>
      {children}
    </DropdownMenuItem>
  )
}
ResponsiveDropdownMenuItem.displayName = "ResponsiveDropdownMenuItem"

type ResponsiveDropdownMenuSeparatorProps = {
  className?: string
}

const ResponsiveDropdownMenuSeparator = ({ className }: ResponsiveDropdownMenuSeparatorProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)")

  if (isMobile) {
    return <hr className={cn("my-2 border-t border-border", className)} />
  }

  return <DropdownMenuSeparator className={className} />
}
ResponsiveDropdownMenuSeparator.displayName = "ResponsiveDropdownMenuSeparator"

type ResponsiveDropdownMenuProps = {
  children: (components: {
    ResponsiveDropdownMenuTrigger: typeof ResponsiveDropdownMenuTrigger
    ResponsiveDropdownMenuContent: typeof ResponsiveDropdownMenuContent
    ResponsiveDropdownMenuGroup: typeof ResponsiveDropdownMenuGroup
    ResponsiveDropdownMenuItem: typeof ResponsiveDropdownMenuItem
    ResponsiveDropdownMenuSeparator: typeof ResponsiveDropdownMenuSeparator
  }) => React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export const ResponsiveDropdownMenu = ({
  children,
  open,
  onOpenChange,
}: ResponsiveDropdownMenuProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)")

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        {children({
          ResponsiveDropdownMenuTrigger,
          ResponsiveDropdownMenuContent,
          ResponsiveDropdownMenuGroup,
          ResponsiveDropdownMenuItem,
          ResponsiveDropdownMenuSeparator,
        })}
      </Drawer>
    )
  }

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      {children({
        ResponsiveDropdownMenuTrigger,
        ResponsiveDropdownMenuContent,
        ResponsiveDropdownMenuGroup,
        ResponsiveDropdownMenuItem,
        ResponsiveDropdownMenuSeparator,
      })}
    </DropdownMenu>
  )
}

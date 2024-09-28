"use client"

import type { VariantProps } from "class-variance-authority"
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "~/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-card hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-7 rounded-md px-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "sq-10",
        "icon-sm": "sq-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  scalingOnClick?: boolean
  Icon?: React.ComponentType<{ className?: string }>
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      scalingOnClick = !asChild,
      Icon,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className, {
          "transition-transform active:scale-[0.98]": scalingOnClick,
        })}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        <div className="flex items-center">
          {isLoading ? (
            <Loader2 className={cn("animate-spin sq-4", { "mr-2": !!children })} />
          ) : (
            Icon && (
              <span className={cn({ "mr-2": !!children })}>
                <Icon className="sq-4" />
              </span>
            )
          )}
          {children}
        </div>
      </Comp>
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }

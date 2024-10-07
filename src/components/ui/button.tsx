"use client"

import type { VariantProps } from "class-variance-authority"
import * as React from "react"
import { Slot, Slottable } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "~/lib/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-md text-sm font-medium ring-offset-background transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground enabled:hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground enabled:hover:bg-destructive/90",
        outline:
          "border border-input bg-card enabled:hover:bg-accent enabled:hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground enabled:hover:bg-secondary/80",
        tertiary: "bg-white text-zinc-800 enabled:hover:bg-zinc-100",
        ghost: "enabled:hover:bg-accent enabled:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 enabled:hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-7 rounded-md px-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "sq-10",
        "icon-sm": "sq-9",
      },
      /**
       * Note: separated so disabled styles don't affect the loading state
       */
      disabled: {
        true: "opacity-50",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      disabled: false,
    },
  },
)
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<VariantProps<typeof buttonVariants>, "disabled"> {
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
        className={cn(buttonVariants({ variant, size, disabled: props.disabled }), className, {
          "enabled:active:scale-[0.98]": scalingOnClick,
        })}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {Icon ? <Icon className="sq-4" /> : null}

        <Slottable>{children}</Slottable>

        {variant !== "link" && (
          <span
            className={cn(
              "pointer-events-none absolute inset-0 grid place-items-center transition",
              {
                "scale-50 opacity-0 backdrop-blur-0": !isLoading,
                "backdrop-blur-xxs": isLoading,
              },
            )}
          >
            <span
              className={cn(
                "bg-accent",
                buttonVariants({ variant, size }),
                "absolute inset-0 border-none bg-opacity-70",
              )}
            />
            <Loader2 className="animate-spin text-current sq-4" />
          </span>
        )}
      </Comp>
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }

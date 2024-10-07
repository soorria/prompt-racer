import { type ComponentProps } from "react"

export type IconProps = Omit<ComponentProps<"svg">, "children">
export type IconComponent = React.FC<IconProps>

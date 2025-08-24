import { HTMLAttributes, ReactNode } from "react"

type ContainerProps = {
    children?: ReactNode;
    direction?: "row" | "col";
} & HTMLAttributes<HTMLElement>;

export default function OuterContainer({ children, className, direction = "col", ...props } : ContainerProps) {
    return (
        <div className={`
            flex-1 w-full max-w-[1392px] flex flex-${direction} items-center justify-center
            ${className}
        `}>
            {children}
        </div>
    )
}
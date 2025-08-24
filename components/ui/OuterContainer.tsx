import { HTMLAttributes, ReactNode } from "react"

type ContainerProps = {
    children?: ReactNode;
} & HTMLAttributes<HTMLElement>;

export default function OuterContainer({ children, className, ...props } : ContainerProps) {
    return (
        <div className={`
            flex-1 w-full max-w-[1392px] flex flex-col items-center justify-center
            ${className}
        `}>
            {children}
        </div>
    )
}
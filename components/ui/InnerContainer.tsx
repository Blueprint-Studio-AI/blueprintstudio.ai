import { HTMLAttributes, ReactNode } from "react"

type ContainerProps = {
    children: ReactNode;
} & HTMLAttributes<HTMLElement>;

export default function InnerContainer({ children, className, ...props } : ContainerProps) {
    return (
        <div className={`
            flex-1 w-full max-w-[1000px]
            bg-blue-500
            ${className}
        `}>
            {children}
        </div>
    )
}
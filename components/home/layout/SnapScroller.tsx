import { ReactNode } from "react";

interface SnapScrollerProps {
    children?: ReactNode;
}

export default function SnapScroller({ children }: SnapScrollerProps) {
    return (
        <div className="h-screen overflow-y-auto snap-y snap-mandatory">
            {children}
        </div>
    );
}
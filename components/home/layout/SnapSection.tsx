import { ReactNode } from "react";

interface SnapSectionProps {
    children?: ReactNode;
}

export default function SnapSection({ children }: SnapSectionProps) {
    return (
        <div className="h-screen w-full snap-start bg-red-500">
            {children}
        </div>
    );
}
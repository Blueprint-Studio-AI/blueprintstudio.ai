// @/features/GestureHandler/Handlers/index.tsx
import { ReactNode, useRef, useEffect } from "react";
import { useBackScrollHandler } from "./backScrollHandler";
import { useScrollHandler } from "./scrollHandler";
import { useKeyHandler } from "./keyHandler";
import { useTouchHandler } from "./touchHandler";

export default function Handlers({ children }: {children: ReactNode}) {

    const viewportRef = useRef<HTMLDivElement>(null);

    useBackScrollHandler(viewportRef); //prevents "go back" gesture on desktop browsers
    useScrollHandler(viewportRef); //doesn't work with "double scroll"
    useKeyHandler(); //may need an intersection observer internally so keys don't go rogue all the time
    useTouchHandler(viewportRef);

    return (
        <div ref={viewportRef} className="size-full">
            {children}
        </div>
    );
}
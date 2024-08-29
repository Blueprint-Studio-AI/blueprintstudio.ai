// @/features/GestureHandler/Handlers/index.tsx
import { ReactNode, useRef } from "react";
import { useBackScrollHandler } from "./backScrollHandler";
import { useScrollHandler } from "./scrollHandler";
import { useKeyHandler } from "./keyHandler";
import { useTouchHandler } from "./touchHandler";

export default function Handlers({ children }: {children: ReactNode}) {

    const viewportRef = useRef<HTMLDivElement>(null);

    useBackScrollHandler(viewportRef); //prevents "go back" gesture on desktop browsers
    useScrollHandler(viewportRef); //doesn't work with "double scroll"
    useKeyHandler(); //may need an intersection observer internally to keys don't go rogue all the time
    useTouchHandler(viewportRef);

    return (
        <div ref={viewportRef} className="size-full">
            {children}
            {/* <div className="absolute top-0 left-0 bg-red-500 size-full"/> */}
            <div style={{
                position: "absolute",
                top: "0px",
                left: "0px",
                backgroundColor: "red",
                width: "100%",
                height: "100%",
                }}/>
        </div>
    );
}
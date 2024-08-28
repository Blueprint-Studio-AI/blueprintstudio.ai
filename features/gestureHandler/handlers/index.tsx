import { ReactNode, useRef } from "react";
import { useBackScrollHandler } from "./backScrollHandler";
import { useScrollHandler } from "./scrollHandler";
import { useKeyHandler } from "./keyHandler";

export default function Handlers({ children }: {children: ReactNode}) {

    const viewportRef = useRef<HTMLDivElement>(null);

    useBackScrollHandler(viewportRef); //prevents "go back" gesture on desktop browsers
    useScrollHandler(viewportRef); //doesn't work with "double scroll"
    useKeyHandler(); //may need an intersection observer internally to keys don't go rogue all the time
    // useTouchHandler(viewportRef);

    return (
        <div ref={viewportRef} style={{width: "100%", height: "100%"}}>
            {children}
        </div>
    );
}
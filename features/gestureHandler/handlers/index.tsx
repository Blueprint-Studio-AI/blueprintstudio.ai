import { ReactNode, useRef } from "react";
import { useScrollHandler } from "./scrollHandler";
import { useBackScrollHandler } from "./backScrollHandler";

export default function Handlers({ children }: {children: ReactNode}) {

    const viewportRef = useRef<HTMLDivElement>(null);

    useBackScrollHandler(viewportRef); //prevents "go back" on desktop browsers
    useScrollHandler(viewportRef);
    // useKeyHandler(viewportRef);

    return (
        <div ref={viewportRef} style={{width: "100%", height: "100%"}}>
            {children}
        </div>
    );
}
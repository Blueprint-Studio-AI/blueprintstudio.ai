// @/features/GestureHandler/Handlers/touchHandler/index.tsx
import { useEffect, useCallback } from "react";
import { GestureData } from "../../types";
import { processTouch } from "./processTouch";

export function useTouchHandler(ref: React.RefObject<HTMLDivElement>) {
    
    const handleTouch = useCallback((event: TouchEvent) => {
        processTouch(event);
    }, []);
    
    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        element.addEventListener("touchstart", handleTouch, { passive: false });
        element.addEventListener("touchmove", handleTouch, { passive: false });
        element.addEventListener("touchend", handleTouch, { passive: false });

        return () => {
            element.removeEventListener('touchstart', handleTouch);
            element.removeEventListener('touchmove', handleTouch);
            element.removeEventListener('touchend', handleTouch);
        };
    }, [ref, handleTouch]);

    return null;
}
// @/features/GestureHandler/Handlers/touchHandler/index.tsx
import { useEffect, useCallback, useRef } from "react";
import { processTouch } from "./processTouch";
import { createTouchDirectionClassifier } from "./classifyTouchDirection";
import { displayTouchMotion } from "./displayTouchMotion";
import { useGestureContext } from "../../useGestureContext";
import { checkTouchThreshold } from "./checkTouchThreshold";
import { handleTap } from "./tapHandler";

export function useTouchHandler(ref: React.RefObject<HTMLDivElement>) {
    const { setGestureActive, updateGesturePosition, x, y, isActive, goUp, goLeft, goRight, goDown } = useGestureContext();
    const classifyTouchDirection = useRef(createTouchDirectionClassifier()).current;

    const handleTouch = useCallback((event: TouchEvent) => {
        const { isTap, isClickableElement } = handleTap(event);
    
        if (event.type === 'touchmove') {
            // Stop scrolling/rubber-banding
            event.preventDefault();
        } else if (isTap || isClickableElement) {
            // Allow taps and events on clickable elements to propagate
            return;
        }

        // For non-touchmove events on non-clickable elements, stop propagation
        if (event.type !== 'touchmove') {
            event.stopPropagation();
        }

        const touchData = processTouch(event);
        if (touchData) {
            setGestureActive(touchData.isActive);
            const direction = classifyTouchDirection(touchData);

            if (direction) {
                const displayPosition = displayTouchMotion(touchData, direction);
                updateGesturePosition(displayPosition.x, displayPosition.y);
            }
            
            if (!touchData.isActive) {
                const finalX = x.get();
                const finalY = y.get();
                checkTouchThreshold(finalX, finalY, { goUp, goLeft, goRight, goDown });
                updateGesturePosition(0, 0);
            }
        }

    }, [updateGesturePosition, setGestureActive, classifyTouchDirection, isActive, goUp, goLeft, goRight, goDown]);
    
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
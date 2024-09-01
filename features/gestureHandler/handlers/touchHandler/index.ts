// @/features/GestureHandler/Handlers/touchHandler/index.tsx
import { useEffect, useCallback, useRef } from "react";
import { processTouch } from "./processTouch";
import { createTouchDirectionClassifier } from "./classifyTouchDirection";
import { displayTouchMotion } from "./displayTouchMotion";
import { useGestureContext } from "../../useGestureContext";
import { checkTouchThreshold } from "./checkTouchThreshold";

export function useTouchHandler(ref: React.RefObject<HTMLDivElement>) {
    const { setGestureActive, updateGesturePosition, x, y, isActive, goUp, goLeft, goRight, goDown } = useGestureContext();
    const classifyTouchDirection = useRef(createTouchDirectionClassifier()).current;

    //
    const CLICK_THRESHOLD = 10; // pixels
    const CLICK_TIMEOUT = 200; // milliseconds

    let touchStartX: number;
    let touchStartY: number;
    let touchStartTime: number;
    //

    const handleTouch = useCallback((event: TouchEvent) => {
        const touch = event.touches[0] || event.changedTouches[0];
        const touchData = processTouch(event);

        // Check if the target is a clickable element
        const isClickableElement = (event.target as HTMLElement).tagName.toLowerCase() === 'button' ||
                                (event.target as HTMLElement).tagName.toLowerCase() === 'a';

        if (event.type === 'touchstart') {
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            touchStartTime = Date.now();
        } else if (event.type === 'touchmove') {
            // Prevent default on touchmove to stop scrolling/rubber-banding
            event.preventDefault();
        } else if (event.type === 'touchend') {
            const deltaX = Math.abs(touch.clientX - touchStartX);
            const deltaY = Math.abs(touch.clientY - touchStartY);
            const deltaTime = Date.now() - touchStartTime;

            if (deltaX < CLICK_THRESHOLD && deltaY < CLICK_THRESHOLD && deltaTime < CLICK_TIMEOUT) {
                console.log('Its a click');
                // This is likely a click, allow it to propagate
                return;
            }
        }

        // If it's a clickable element, don't interfere
        if (isClickableElement) {
            return;
        }

        // For non-touchmove events on non-clickable elements, stop propagation
        if (event.type !== 'touchmove') {
            event.stopPropagation();
        }


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
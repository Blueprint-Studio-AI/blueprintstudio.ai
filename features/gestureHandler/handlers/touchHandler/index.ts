// @/features/GestureHandler/Handlers/touchHandler/index.tsx
import { useEffect, useState, useContext } from "react";
import { GestureContext } from "../../GestureContext";
import { GestureData } from '../../types';

export function useTouchHandler(ref: React.RefObject<HTMLDivElement>) {
    // const { goUp, goLeft, goRight, goDown, setGestureData } = useContext(GestureContext);
    const [startTouch, setStartTouch] = useState<Touch | null>(null);
    
    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                setStartTouch(e.touches[0]);
                console.log('Start touch:', e.touches[0])
            }
            const startTouch = e.touches[0];
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!startTouch) return;
            const currentTouch = e.touches[0];
            console.log('Touch move:', currentTouch);
        };

        const handleTouchEnd = () => {
            setStartTouch(null);
            console.log('Touch ended');
        };


        element.addEventListener("touchstart", handleTouchStart);
        element.addEventListener("touchmove", handleTouchMove);
        element.addEventListener("touchend", handleTouchEnd);

        return () => {
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchmove', handleTouchMove);
            element.removeEventListener('touchend', handleTouchEnd);
        };
    }, [ref, startTouch])
}
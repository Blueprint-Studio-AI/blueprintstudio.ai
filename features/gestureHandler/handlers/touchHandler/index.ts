import { useEffect, useState, useContext } from "react";
import { GestureContext } from "../../GestureContext";
import { GestureData } from '../../types';

export default function useTouchHandler(ref: React.RefObject<HTMLDivElement>) {
    // const { setGestureData } = useContext(GestureContext);
    const [startPosition, setStartPosition] = useState<{ x: number, y: number } | null>(null);
    
    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const handleTouchStart = (e: TouchEvent) => {
            const touch = e.touches[0];
            setStartPosition({ x: touch.clientX, y: touch.clientY });
            // setGestureData({ x: 0, y: 0, isActive: true });
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!startPosition) return;
            const touch = e.touches[0];
            const deltaX = touch.clientX - startPosition.x;
            const deltaY = touch.clientY - startPosition.y;
            // setGestureData({ x: deltaX, y: deltaY, isActive: true });
        };

        const handleTouchEnd = () => {
            setStartPosition(null);
            // setGestureData({ x: 0, y: 0, isActive: false });
        };


        element.addEventListener("touchstart", handleTouchStart);
        element.addEventListener("touchmove", handleTouchStart);
        element.addEventListener("touchend", handleTouchStart);

        return () => {
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchmove', handleTouchMove);
            element.removeEventListener('touchend', handleTouchEnd);
        };
    }, [ref, setGestureData, startPosition])
}
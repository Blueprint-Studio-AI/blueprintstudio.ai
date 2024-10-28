// @/components/home/TikTok/utils/carouselLogic.ts
import { useState, useRef } from "react";
import { animate, useMotionValue, useTransform } from "framer-motion";
import { useGestureContext } from "@/features/GestureHandler/useGestureContext";
import { useGestureAction } from "@/features/GestureHandler/useGestureAction";
import { CAROUSEL_GAP, PADDING } from "../template/constants";
import { useViewport } from "@/utils/hooks/useViewport";

export function useCarouselLogic(cardCount: number) {
    const [activeCard, setActiveCard] = useState(0);
    const x = useMotionValue(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const { width: viewportWidth } = useViewport();

    const cardWidth = viewportWidth - (PADDING * 2);

    const { x: gestureX } = useGestureContext();

    const combinedX = useTransform<number, number>(
        [x, gestureX] as const,
        ([baseX, gestureXValue]) => baseX + gestureXValue
    );

    const goToCard = (index: number) => {
        const newIndex = Math.max(0, Math.min(cardCount - 1, index));
        setActiveCard(newIndex);
        
        const newX = -newIndex * (cardWidth + CAROUSEL_GAP);
        
        animate(x, newX, {
            type: "tween",
            duration: 0.2,
            ease: "easeOut"
        });
    };

    const goToNextCard = () => goToCard(activeCard - 1);
    const goToPreviousCard = () => goToCard(activeCard + 1);

    useGestureAction('right', goToPreviousCard);
    useGestureAction('left', goToNextCard);

    return {
        activeCard,
        combinedX,
        containerRef,
        cardWidth,
    };
}
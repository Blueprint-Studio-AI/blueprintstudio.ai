// @/components/home/TikTok/utils/carouselLogic.ts
import { useState, useRef, useEffect } from "react";
import { animate, useMotionValue, useTransform } from "framer-motion";
import { useGestureContext } from "@/features/GestureHandler/useGestureContext";
import { useGestureAction } from "@/features/GestureHandler/useGestureAction";
import { CAROUSEL_GAP, PADDING, LEFT_PADDING_CAROUSEL_M, LEFT_PADDING_CAROUSEL_PC } from "../template/constants";
import { useViewport } from "@/utils/hooks/useViewport";

const TRANSITION_TIME = 0.1; //s

export function useCarouselLogic(cardCount: number, isActive : boolean, isCarousel : boolean) {
    const [activeCard, setActiveCard] = useState(0);
    const x = useMotionValue(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const { width: viewportWidth } = useViewport();
    const [cardWidth, setCardWidth] = useState<number | null>(null);
    const { x: gestureX } = useGestureContext();
    //Update cardWidth when viewport changes
    useEffect(() => {
        // setCardWidth(viewportWidth - (PADDING * 2));
        const padding = viewportWidth > 1024 ? LEFT_PADDING_CAROUSEL_PC : LEFT_PADDING_CAROUSEL_M;
        setCardWidth(viewportWidth - CAROUSEL_GAP*2);
    }, [viewportWidth]);

    // Update x position when viewport or cardWidth changes
    useEffect(() => {
        if (cardWidth === null) return;
        
        // const newX = -activeCard * (cardWidth + CAROUSEL_GAP);
        const newX = -activeCard * (cardWidth );

        // Animate to new position smoothly
        animate(x, newX, {
            type: "tween",
            duration: TRANSITION_TIME,
            ease: "easeOut"
        });
    }, [viewportWidth, cardWidth, activeCard]);

    const combinedX = useTransform<number, number>(
        [x, gestureX] as const,
        ([baseX, gestureXValue]) => baseX + gestureXValue
    );

    const goToCard = (index: number) => {
        if(isCarousel && !isActive) return false;
        const newIndex = Math.max(0, Math.min(cardCount - 1, index));
        setActiveCard(newIndex);

        if (cardWidth === null) return;
        // const newX = -newIndex * (cardWidth + CAROUSEL_GAP);
        const newX = -newIndex * (cardWidth);
        
        animate(x, newX, {
            type: "tween",
            duration: TRANSITION_TIME,
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
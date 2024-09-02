// @/components/home/TikTok/sectionLogic.ts

import { useState, useRef, RefObject } from "react";
import { animate, MotionValue, useMotionValue, useTransform } from "framer-motion";
import { useGestureContext } from "@/features/GestureHandler/useGestureContext";
import { useGestureAction } from "@/features/GestureHandler/useGestureAction";

export function useSectionLogic(projectsCount: number) {
    const [activeSection, setActiveSection] = useState(0);
    const y = useMotionValue(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const { y: gestureY } = useGestureContext();

    const combinedY = useTransform<number, number>(
        [y, gestureY] as const,
        ([baseY, gestureYValue]) => baseY + gestureYValue
    );

    const goToSection = (index: number) => {
        const newIndex = Math.max(0, Math.min(projectsCount - 1, index));
        setActiveSection(newIndex);
        
        const containerHeight = containerRef.current?.clientHeight || 0;
        const newY = -newIndex * containerHeight * 0.95; // 95svh
        
        animate(y, newY, {
            type: "tween",
            duration: 0.2,
            ease: "easeOut"
        });
    };

    const goToNextSection = () => goToSection(activeSection + 1);
    const goToPreviousSection = () => goToSection(activeSection - 1);

    useGestureAction('down', goToNextSection);
    useGestureAction('up', goToPreviousSection);

    return {
        activeSection,
        combinedY,
        containerRef,
    };
}
// @/components/home/TikTok/sectionLogic.ts
import { useState, useRef, RefObject, Dispatch, SetStateAction } from "react";
import { animate, MotionValue, useMotionValue, useTransform } from "framer-motion";
import { useGestureContext } from "@/features/GestureHandler/useGestureContext";
import { useGestureAction } from "@/features/GestureHandler/useGestureAction";
import { SECTION_HEIGHT } from "../../template/constants";

export interface UseSectionLogicReturn {
    activeSection: number;
    combinedY: MotionValue<number>;
    containerRef: RefObject<HTMLDivElement>;
    setSnapLock: Dispatch<SetStateAction<SnapLockType>>;
}

type SnapLockType = 'noUp' | 'noDown' | 'locked' | null;

export function useSectionLogicFunction(projectsCount: number): UseSectionLogicReturn {
    const [activeSection, setActiveSection] = useState<number>(0);
    const [snapLock, setSnapLock] = useState<SnapLockType>(null);
    // const [rubberBandLock, setRubberBandLock] = useState<boolean>(true);
    const y = useMotionValue(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const { y: gestureY } = useGestureContext();

    const combinedY = useTransform<number, number>(
        [y, gestureY] as const,
        ([baseY, gestureYValue]) => {
            // if (rubberBandLock) return baseY;
            if (snapLock) return baseY;
            return baseY + gestureYValue;
        }
    );

    const goToSection = (index: number) => {
        if (snapLock === 'locked') return;
        if (snapLock === 'noUp' && index < activeSection) return;
        if (snapLock === 'noDown' && index > activeSection) return;

        const newIndex = Math.max(0, Math.min(projectsCount - 1, index));
        setActiveSection(newIndex);
        
        const containerHeight = containerRef.current?.clientHeight || 0;
        const newY = -newIndex * containerHeight * (SECTION_HEIGHT/100); // svh
        
        animate(y, newY, {
            type: "tween",
            duration: 0.15,
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
        setSnapLock
    };
}
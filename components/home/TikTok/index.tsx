// @/components/home/TikTok/index.tsx

import { useRef, useState } from "react";
import TikTokSection from "./template/TikTokSection";
import { useGestureContext } from "@/features/GestureHandler/useGestureContext";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useGestureAction } from "@/features/GestureHandler/useGestureAction";

export default function TikTok() {
    const [activeSection, setActiveSection] = useState(0);
    const y = useMotionValue(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const { y: gestureY } = useGestureContext();

    const combinedY = useTransform<number, number>(
        [y, gestureY] as const,
        ([baseY, gestureYValue]) => baseY + gestureYValue
      );

    const goToSection = (index: number) => {
        const newIndex = Math.max(0, Math.min(projects.length - 1, index));
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

    // This could be generated at build time,
    // but for now we can to manually insert them bc a lot easier
    const projects = ['IDScanner', 'ReportGPT', 'SDN'];
    
    return (
        <div ref={containerRef} className="relative h-svh w-screen bg-red-300 overflow-hidden" >
            <motion.div style={{ y: combinedY }} className="absolute top-0 left-0 w-full">
                {projects.map((project, index) => (
                    <TikTokSection 
                        key={project}
                        project={project}
                        index={index}
                        isActive={index === activeSection}
                    />
                ))}
            </motion.div>
        </div>
    );
}
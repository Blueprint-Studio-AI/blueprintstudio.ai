"use client";
import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useBreakpoint } from "@/lib/breakpoints";
import CompassSVG from "./CompassSVG";
import ChatBubbles from "./ChatBubbles";
import Map from "./Map";

interface Achievement {
  id: number;
  title: string;
  description: string;
}

interface AchievementCardProps {
  achievement: Achievement;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function AchievementCard({ 
  achievement, 
  isHovered, 
  onMouseEnter, 
  onMouseLeave 
}: AchievementCardProps) {
  const breakpoint = useBreakpoint();
  const [elementRef, isIntersecting] = useIntersectionObserver({
    threshold: 0.6, // Trigger when 60% of the card is visible (roughly center screen)
    rootMargin: "-20% 0px -20% 0px" // More strict centering
  });

  // Use intersection observer for smaller breakpoints (xs, sm, md), hover for larger
  const shouldUseIntersection = breakpoint === "base" || breakpoint === "xs" || breakpoint === "sm" || breakpoint === "md";
  const isActive = shouldUseIntersection ? isIntersecting : isHovered;

  return (
    <motion.div
      ref={elementRef}
      className="flex flex-col items-start gap-4 flex-1 rounded-[20px] border border-neutral-300 bg-neutral-200 p-4 pb-6 h-[361px] bg-[#FAFAFA]"
      onMouseEnter={shouldUseIntersection ? undefined : onMouseEnter}
      onMouseLeave={shouldUseIntersection ? undefined : onMouseLeave}
      animate={{
        y: !shouldUseIntersection && isHovered ? -25 : 0
      }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      {/* Top section with dot background and visual placeholder */}
      <div 
        className="w-full flex-1 rounded-lg relative border border-neutral-300 bg-neutral-100 overflow-hidden"
        style={{
          // backgroundImage: 'radial-gradient(circle, hsl(var(--neutral-300)) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      >
        {/* Visual components for each card */}
        <div className="absolute inset-0 flex items-center justify-center">
          {achievement.id === 1 ? (
            <CompassSVG isHovered={isActive} />
          ) : achievement.id === 2 ? (
            <Map isActive={isActive} />
          ) : achievement.id === 3 ? (
            <ChatBubbles isHovered={isActive} />
          ) : (
            <div className="w-16 h-16 bg-neutral-400 rounded-full opacity-60" />
          )}
        </div>
      </div>

      {/* Text content */}
      <div className="flex flex-col items-start gap-3 w-full">
        <h3 className="font-medium text-black text-lg leading-tight">
          {achievement.title}
        </h3>
        <p className="text-neutral-500 text-sm leading-relaxed">
          {achievement.description}
        </p>
      </div>
    </motion.div>
  );
}
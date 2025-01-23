import React from 'react';
import { Children, ReactNode } from "react";
import { useCarouselLogic } from "../../utils/carouselLogic";
import { motion } from "framer-motion";
import { CAROUSEL_GAP } from "../constants";
import { useViewport } from "@/utils/hooks/useViewport";

interface TikTokCarouselProps {
    isActive: boolean;
    children: ReactNode;
    isCarousel: boolean;
}

export default function TikTokCarousel({ isActive, children, isCarousel }: TikTokCarouselProps) {
    const { width: viewportWidth } = useViewport();
    const childArray = Children.toArray(children);
    const { activeCard, combinedX, containerRef, cardWidth } = useCarouselLogic(childArray.length, isActive, isCarousel);
    return (
        <div className="w-full h-full flex flex-col justify-between">
            <div ref={containerRef} className="tiktok-wrapper relative" >
                <motion.div 
                    className="absolute h-full flex"
                    style={{ x: combinedX }}
                >
                    {childArray.map((child, index) => (
                        <div
                            key={index}
                            style={{
                                width: cardWidth ? `${cardWidth}px` : '100vw',
                                flexShrink: 0,
                                marginLeft: index !==activeCard && index + activeCard -1 < activeCard ? (viewportWidth >= 1024 ? CAROUSEL_GAP*10 : CAROUSEL_GAP ) : 0,
                                paddingLeft: index === activeCard ? (viewportWidth >= 1024 ? CAROUSEL_GAP * 2 : CAROUSEL_GAP) : 0,
                                paddingRight: index === activeCard ? (viewportWidth >= 1024 ? CAROUSEL_GAP * 2 : CAROUSEL_GAP) : 0
                            }}
                        >
                            {child}
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
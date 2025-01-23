import React from 'react';
import { Children, ReactNode, useEffect } from "react";
import { useCarouselLogic } from "../../utils/carouselLogic";
import { motion } from "framer-motion";
import { CAROUSEL_GAP, PADDING, LEFT_PADDING_CAROUSEL_M, LEFT_PADDING_CAROUSEL_PC  } from "../constants";
import { useViewport } from "@/utils/hooks/useViewport";

interface TikTokCarouselProps {
    isActive: boolean;
    children: ReactNode;
    isCarousel: boolean;
}

export default function TikTokCarousel({ isActive, children, isCarousel }: TikTokCarouselProps) {
    const { width: viewportWidth } = useViewport();
    const childArray = Children.toArray(children);
    // TODO update activeCard
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
                                // marginRight: index < childArray.length - 1 ? `${CAROUSEL_GAP}px` : 0,
                                marginLeft: index !==activeCard && index + activeCard -1 < activeCard ? `${CAROUSEL_GAP}px` : 0,
                                paddingLeft: index === activeCard ? (viewportWidth >= 1024 ? LEFT_PADDING_CAROUSEL_PC : CAROUSEL_GAP) : 0,
                                paddingRight: index === activeCard ? (viewportWidth >= 1024 ? LEFT_PADDING_CAROUSEL_PC : CAROUSEL_GAP) : 0
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
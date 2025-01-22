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
                                marginRight: index < childArray.length - 1 ? `${CAROUSEL_GAP}px` : 0,
                                paddingLeft: index === activeCard ? (viewportWidth >= 1024 ? LEFT_PADDING_CAROUSEL_PC : LEFT_PADDING_CAROUSEL_M) : 0
                            }}
                        >
                            {child}
                        </div>
                    ))}
                </motion.div>
            </div>
            {/* TODO: do we need to this block? */}
            {/* <div className="py-2">
                <div className="flex justify-center gap-2">
                    {childArray.map((_, index) => (
                        <div 
                            key={index}
                            className={`w-2 h-2 rounded-full ${
                                index === activeCard ? 'bg-white' : 'bg-gray-500'
                            }`}
                        />
                    ))}
                </div>
            </div> */}
        </div>
    );
}
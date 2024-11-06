import { Children, ReactNode, useEffect } from "react";
import { useCarouselLogic } from "../../utils/carouselLogic";
import { motion } from "framer-motion";
import { CAROUSEL_GAP, PADDING } from "../constants";

interface TikTokCarouselProps {
    isActive: boolean;
    children: ReactNode;
}
 
export default function TikTokCarousel({ isActive, children }: TikTokCarouselProps) {
    const childArray = Children.toArray(children);
    const { activeCard, combinedX, containerRef, cardWidth } = useCarouselLogic(childArray.length);

    return (
        <div className="w-full h-full bg-black flex flex-col justify-between">
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
                                marginRight: index < childArray.length - 1 ? `${CAROUSEL_GAP}px` : 0
                            }}
                        >
                            {child}
                        </div>
                    ))}
                </motion.div>
            </div>
            <div className="py-2">
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
            </div>
        </div>
    );
}
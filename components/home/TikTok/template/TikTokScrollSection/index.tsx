// @/components/home/TikTok/template/TikTokSection/index.tsx
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { motion } from "framer-motion";
import { useSectionLogic } from '../../utils/SectionLogicProvider';
import { useGesture } from '@use-gesture/react';

interface TikTokScrollSectionProps {
    isActive: boolean;
    children: ReactNode;
}

export default function TikTokScrollSection({ isActive, children }: TikTokScrollSectionProps) {
    const { setSnapLock } = useSectionLogic();
    const [y, setY] = useState(0);

    const dragStartY = useRef(0);
    
    useEffect(() => {
        if (isActive) setSnapLock('locked')
    }, [isActive])

    const bind = useGesture({
        onWheel: ({ delta: [_, dy] }) => {
            setY(prev => prev - dy);
        },
        onDragStart: () => {
            dragStartY.current = y;
        },
        onDrag: ({ movement: [_, my] }) => {
            setY(dragStartY.current + my);
        }
    })

    return (
        <div
            className="w-full h-full overflow-hidden bg-blue-300 touch-none"
            {...bind()}
        > {/* Fixed viewport */}
            <div className="relative h-full w-full bg-yellow-200"> {/* Positioning context */}
                <motion.div
                    className="absolute w-full h-auto"
                    style={{ y }}
                > {/* Moving content */}
                    {/* <div className='sentinel-top w-full h-2 bg-red-500'/> */}
                    {children}
                    {/* <div className='sentinel-bottom w-full h-2 bg-red-500'/> */}
                </motion.div>
            </div>
        </div>
    );
}
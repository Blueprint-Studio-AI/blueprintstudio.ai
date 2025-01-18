// @/components/home/TikTok/index.tsx
import React from 'react';
import TikTokSection from "./template/TikTokSection";
import { motion } from "framer-motion";
import { useSectionLogic } from "./utils/sectionLogic";
import { PROJECT_NAMES } from './content/projects';

export default function TikTok() {

    const { activeSection, combinedY, containerRef } = useSectionLogic(PROJECT_NAMES.length);
    return (
        <div ref={containerRef} className="relative h-svh w-screen overflow-hidden" >
            <motion.div style={{ y: combinedY }} className="absolute top-0 left-0 w-full">
                {PROJECT_NAMES.map((project, index) => (
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
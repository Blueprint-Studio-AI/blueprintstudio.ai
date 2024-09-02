// @/components/home/TikTok/index.tsx

import TikTokSection from "./template/TikTokSection";
import { motion } from "framer-motion";
import { useSectionLogic } from "./utils/sectionLogic";

export default function TikTok() {

    // This could be generated at build time,
    // but for now we can to manually insert them bc a lot easier
    const projects = ['IDScanner', 'ReportGPT', 'SDN'];

    const { activeSection, combinedY, containerRef } = useSectionLogic(projects.length);
    
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
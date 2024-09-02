// @/components/home/TikTok/template/TikTokSection/index.tsx

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TikTokSectionProps {
    project: string;
    isActive: boolean;
    index: number;
}

type ProjectComponentType = React.ComponentType<{}>;

export default function TikTokSection({ project, isActive, index }: TikTokSectionProps) {
    const [ProjectContent, setProjectContent] = useState<ProjectComponentType | null>(null);

    useEffect(() => {
        import(`@/components/home/TikTok/content/${project}`).then(module => {
            setProjectContent(() => module.default);
        });
    }, [project]);

    return (
        <motion.div
            className="absolute h-[95svh] w-screen bg-blue-200 border border-black"
            style={{ top: `calc(${index * 95}svh)` }} // align vertically
        >
            {ProjectContent && <ProjectContent />}
        </motion.div>
    );
}
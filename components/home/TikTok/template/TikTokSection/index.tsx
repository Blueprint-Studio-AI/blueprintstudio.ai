// @/components/home/TikTok/template/TikTokSection/index.tsx

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TikTokSectionProps {
    project: string;
    isActive: boolean;
}

type ProjectComponentType = React.ComponentType<{}>;

export default function TikTokSection({ project, isActive }: TikTokSectionProps) {
    const [ProjectContent, setProjectContent] = useState<ProjectComponentType | null>(null);

    useEffect(() => {
        import(`@/components/home/TikTok/content/${project}`).then(module => {
            setProjectContent(() => module.default);
        });
    }, [project]);

    return (
        <motion.div
          className="absolute h-[95svh] w-screen bg-blue-200 border border-black"
          initial={{ y: '100%' }}
          animate={{ y: isActive ? '0%' : '100%' }}
          transition={{ type: 'tween', duration: 0.5 }}
        >
            {ProjectContent && <ProjectContent />}
        </motion.div>
    );
}
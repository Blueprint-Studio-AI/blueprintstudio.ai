// @/components/home/TikTok/template/TikTokSection/index.tsx
import { motion } from "framer-motion";
import { PROJECTS } from "../../content/projects";
import { PADDING, SECTION_HEIGHT } from "../constants";

interface TikTokSectionProps {
    project: string;
    isActive: boolean;
    index: number;
}

export default function TikTokSection({ project, isActive, index }: TikTokSectionProps) {
    const ProjectContent = PROJECTS[project as keyof typeof PROJECTS];

    return (
        <motion.div
            className={`absolute h-[${SECTION_HEIGHT}svh] w-screen bg-blue-200`}
            style={{ top: `calc(${index * SECTION_HEIGHT}svh)` }} // align vertically
        >
            <div
                className={`h-full w-full bg-black`}
                style={{ padding: `${PADDING}px` }}
            >
                <div className="tiktok-wrapper">
                    <div className="h-full w-full bg-white">
                        <ProjectContent isActive={isActive} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
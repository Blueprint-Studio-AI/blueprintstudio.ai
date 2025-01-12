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
            className={`absolute w-screen`}
            style={{
                top: `calc(${index * SECTION_HEIGHT}svh)`,  // align vertically
                height: `${SECTION_HEIGHT}svh`  // height
            }}
        >
            <div
                className={`h-full w-full `}
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
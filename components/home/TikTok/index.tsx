// @/components/home/TikTok/index.tsx

import { useState } from "react";
import TikTokSection from "./template/TikTokSection";

export default function TikTok() {
    const [activeSection, setActiveSection] = useState(0);

    // This could be generated at build time,
    // but for now we can to manually insert them bc a lot easier
    const projects = ['IDScanner', 'ReportGPT', 'SDN'];

    const goToNextSection = () => {
        setActiveSection((prev) => (prev < projects.length - 1 ? prev + 1 : prev));
    };

    const goToPreviousSection = () => {
        setActiveSection((prev) => (prev > 0 ? prev - 1 : prev));
    };
    
    return (
        <div className="relative h-svh w-screen bg-red-300 overflow-hidden">
            {projects.map((project, index) => (
                <TikTokSection 
                    key={project}
                    project={project}
                    isActive={index === activeSection}
                />
            ))}
            <div className="fixed bottom-4 right-4 z-10">
                <button onClick={goToPreviousSection} className="mr-2 p-2 bg-gray-200 rounded">Up</button>
                <button onClick={goToNextSection} className="p-2 bg-gray-200 rounded">Down</button>
                <p>Active Section: {activeSection}</p>
            </div>
        </div>
    );
}
"use client";

import { MotionConfig } from "framer-motion";
import ProjectPanel, { type PanelProject } from "./ProjectPanel";

export default function Wall({ projects }: { projects: PanelProject[] }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className="flex flex-col gap-3 sm:gap-5 lg:gap-8">
        {projects.map((project, i) => (
          // The first panel is above the fold: its media loads straight away.
          <ProjectPanel key={project.id} project={project} index={i} total={projects.length} eager={i === 0} />
        ))}
      </div>
    </MotionConfig>
  );
}

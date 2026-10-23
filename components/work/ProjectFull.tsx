"use client";

import type { ShowcaseData } from "@/lib/work";
import { Caption, Stage, useActiveFrame } from "./Showcase";

// Layout B's block for one piece of work: its hero as large as the screen
// allows (16:9 on desktop, the vertical cut on phones), then its name and line.
export default function ProjectFull({ data }: { data: ShowcaseData }) {
  const { active, picked } = useActiveFrame(data);
  return (
    <article id={data.id} aria-label={data.title} className="scroll-mt-24">
      <div className="group/project relative mx-auto lg:w-[min(100%,calc((100svh-140px)*16/9))]">
        <div className="group/stage relative">
          <Stage data={data} active={active} picked={picked} sizes="(min-width: 1480px) 1420px, 96vw" />
        </div>
        <Caption data={data} active={active} as="h2" className="pt-5 lg:pt-7" />
      </div>
    </article>
  );
}

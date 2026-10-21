"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ResponsiveMedia } from "@/data/portfolioData";
import PanelMedia from "./PanelMedia";

export interface PanelTag {
  label: string;
  /** Another /work page, for a deliverable that has one. */
  href?: string;
}

export interface PanelProject {
  id: string;
  title: string;
  description: string;
  media: ResponsiveMedia;
  tags: PanelTag[];
  liveUrl?: string;
  brandPage?: string;
}

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const linkClass =
  "group/link inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors duration-200";

export default function ProjectPanel({
  project,
  index,
  total,
  eager = false,
}: {
  project: PanelProject;
  index: number;
  total: number;
  eager?: boolean;
}) {
  const n = (i: number) => String(i).padStart(2, "0");

  return (
    <motion.article
      id={project.id}
      aria-labelledby={`${project.id}-title`}
      // Rises and sharpens into place; MotionConfig (reducedMotion="user") on
      // the wall drops the rise for visitors who ask for less motion.
      initial={{ opacity: 0, y: 64, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{
        y: { type: "spring", stiffness: 70, damping: 18, mass: 1 },
        opacity: { duration: 0.7, ease: EASE_OUT },
        filter: { duration: 0.8, ease: EASE_OUT },
      }}
      className="group/panel scroll-mt-24 rounded-[22px] bg-[#EDEDEC] p-2.5 sm:p-3 lg:rounded-[32px] lg:p-4"
    >
      <div className="transition-transform [transition-duration:900ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover/panel:scale-[1.006] motion-reduce:transform-none">
        <PanelMedia media={project.media} eager={eager} />
      </div>

      <div className="grid gap-5 px-2 pb-3 pt-5 sm:px-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-10 lg:px-4 lg:pb-4 lg:pt-7">
        <div className="min-w-0">
          <div className="mb-2 font-mono text-[11px] tabular-nums text-neutral-500 lg:mb-3">
            {n(index + 1)} / {n(total)}
          </div>
          <h2
            id={`${project.id}-title`}
            className="text-[22px] font-medium leading-[1.15] tracking-[-0.03em] text-black lg:text-[28px]"
          >
            {project.title}
          </h2>
          <p className="mt-2 max-w-[60ch] text-[15px] leading-[1.45] text-neutral-600 lg:text-base">{project.description}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tags">
            {project.tags.map((tag) => (
              <li key={tag.label}>
                {tag.href ? (
                  <Link
                    href={tag.href}
                    className="inline-flex h-7 items-center rounded-full bg-white/60 px-2.5 text-xs text-neutral-600 transition-colors duration-200 hover:bg-white hover:text-black"
                  >
                    {tag.label}
                  </Link>
                ) : (
                  <span className="inline-flex h-7 items-center rounded-full bg-white/60 px-2.5 text-xs text-neutral-600">
                    {tag.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {(project.liveUrl || project.brandPage) && (
          <div className="flex flex-wrap gap-2 lg:justify-end">
            {project.brandPage && (
              <Link href={`/brands/${project.brandPage}`} className={`${linkClass} bg-white text-black hover:bg-neutral-900 hover:text-white`}>
                Brand page
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover/link:translate-x-0.5" />
              </Link>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener"
                className={`${linkClass} bg-neutral-900 text-white hover:bg-black`}
              >
                Visit site
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}

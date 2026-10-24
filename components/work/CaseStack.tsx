"use client";

import Image from "next/image";
import type { ShowcaseData } from "@/lib/work";
import { Caption, Stage, useActiveFrame } from "./Showcase";

export interface CaseStory {
  problem?: string;
  process?: string[];
  solution?: string;
}

// A piece of work as a case: its name and a small tag, then big images one
// after another (the hero clip, then the stills two up and the phone cut),
// then a short story in three parts where we have one. After the original
// Blueprint site's case pages, which Tyler liked; the grey-box grid stays for
// cards. Used by layout B and the client pages.
export default function CaseStack({
  data,
  tag,
  story,
  phone,
  eager = false,
}: {
  data: ShowcaseData;
  /** Small pill beside the name, e.g. "Website · 2026". */
  tag?: string;
  story?: CaseStory;
  /** The vertical cut's poster, shown with the stills. */
  phone?: { src: string; alt: string };
  eager?: boolean;
}) {
  const { active, picked } = useActiveFrame(data);
  const images = [...data.stills.map((s) => ({ src: s.src, alt: s.alt, phone: false })), ...(phone ? [{ ...phone, phone: true }] : [])];

  return (
    <article id={data.id} aria-label={data.title} className="scroll-mt-24">
      <div className="group/project relative">
        {tag && (
          <span className="inline-flex h-7 items-center rounded-full bg-black/[0.05] px-3 font-mono text-[11px] uppercase tracking-wide text-neutral-600">
            {tag}
          </span>
        )}
        <Caption data={data} active={active} as="h2" className={`pb-6 lg:pb-8 ${tag ? "pt-4" : ""}`} />
        <div className="group/stage relative">
          <Stage data={data} active={active} picked={picked} eager={eager} sizes="(min-width: 1480px) 1420px, 96vw" />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-2 sm:gap-3 lg:mt-12 lg:gap-4">
        {images.map((image) => (
          <div key={image.src} className="relative aspect-square overflow-hidden rounded-[12px] bg-[#EDEDEC] lg:rounded-[18px]">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              quality={85}
              sizes="(min-width: 1480px) 710px, 48vw"
              className={image.phone ? "object-cover object-top" : "object-cover"}
            />
          </div>
        ))}
      </div>

      {story && (story.problem || story.process?.length || story.solution) && (
        <dl className="mt-10 grid gap-8 border-t border-black/10 pt-8 lg:mt-14 lg:grid-cols-3 lg:gap-12 lg:pt-10">
          {story.problem && (
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-wide text-neutral-500">Problem</dt>
              <dd className="mt-3 text-pretty text-[17px] leading-[1.5] text-neutral-700">{story.problem}</dd>
            </div>
          )}
          {story.process && story.process.length > 0 && (
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-wide text-neutral-500">Process</dt>
              <dd className="mt-3">
                <ul className="flex flex-col gap-2 text-[17px] leading-[1.5] text-neutral-700">
                  {story.process.map((step) => (
                    <li key={step} className="flex gap-2.5">
                      <span aria-hidden className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-neutral-400" />
                      {step}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          )}
          {story.solution && (
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-wide text-neutral-500">Solution</dt>
              <dd className="mt-3 text-pretty text-[17px] leading-[1.5] text-neutral-700">{story.solution}</dd>
            </div>
          )}
        </dl>
      )}
    </article>
  );
}

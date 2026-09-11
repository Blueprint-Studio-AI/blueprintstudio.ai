"use client";

// Motion (brand.motion) — the animated illustrations and films a client keeps
// asking for, as ready-to-paste files.
//
// Every clip is exported three ways because each lands somewhere different:
// MP4 for decks and X, WebM for the web, GIF for Slack, Notion and docs that
// won't play video. The card previews the MP4 on a loop (muted, so browsers
// allow autoplay); the buttons hand over the files.
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useBrand } from "@/components/brands/kit/BrandContext";
import type { MotionClip } from "@/components/brands/kit/types";
import Button from "@/components/brands/kit/ui/Button";
import { DownloadIcon } from "@/components/brands/kit/ui/icons";

function Clip({ clip, dir }: { clip: MotionClip; dir: string }) {
  // Only mount the <video> once the card nears the viewport — a dozen looping
  // MP4s fetching on page load is what made the asset generator card lazy too.
  const stage = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = stage.current;
    if (!el || near) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setNear(true);
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

  const base = `${dir}/${clip.id}`;
  const fit = clip.fit === "contain" ? "object-contain p-6" : "object-cover";
  return (
    <figure className="m-0 flex flex-col gap-4">
      <div
        ref={stage}
        className="relative overflow-hidden rounded-2xl"
        style={{ background: clip.stage ?? "#ffffff", aspectRatio: clip.aspect }}
      >
        {/* The still is always there, through next/image (the posters are
            150–900 KB PNGs; this serves a WebP sized to the card). Once the card
            is near, the video mounts on top of it with no `poster`, so the PNG
            isn't fetched a second time; until its first frame paints, the still
            shows through. */}
        <Image src={`${base}-poster.png`} alt="" fill sizes="(max-width: 860px) 100vw, 560px" className={fit} />
        {near && (
          <video
            src={`${base}.mp4`}
            autoPlay
            loop
            muted
            playsInline
            aria-label={clip.name}
            className={`absolute inset-0 h-full w-full ${fit}`}
          />
        )}
      </div>
      <figcaption className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="min-w-0">
          <div className="text-meta font-medium tracking-snug text-ink">{clip.name}</div>
          <div className="font-mono text-micro text-muted-3">
            {clip.dims} · {clip.duration} · {clip.loop ? "seamless loop" : "one shot"}
          </div>
        </div>
        {/* one ghost pill per format — the label is the format, so a list of
            downloads still reads as MP4 / WebM / GIF rather than Download ×3 */}
        <div className="flex shrink-0 gap-1">
          {(["mp4", "webm", "gif"] as const).map((ext) => (
            <Button
              key={ext}
              variant="ghost"
              size="sm"
              href={`${base}.${ext}`}
              download
              aria-label={`Download ${clip.name} as ${ext.toUpperCase()}`}
              className="!px-2.5 uppercase"
            >
              {ext}
              <DownloadIcon size={14} />
            </Button>
          ))}
        </div>
      </figcaption>
    </figure>
  );
}

export default function Motion() {
  const { motion } = useBrand();
  if (!motion) return null;
  return (
    <section className="flex flex-col gap-16 px-edge pb-section pt-16">
      <div className="statement">
        <div className="grid grid-cols-2 gap-x-6 gap-y-14 max-[860px]:grid-cols-1">
          {motion.clips.map((c) => (
            <Clip key={c.id} clip={c} dir={motion.dir} />
          ))}
        </div>
      </div>
    </section>
  );
}

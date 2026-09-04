"use client";

// Motion — the animated illustrations and films the Arch team keeps asking
// for, as ready-to-paste files.
//
// Every clip is exported three ways because each lands somewhere different:
// MP4 for decks and X, WebM for the web, GIF for Slack, Notion and docs that
// won't play video. The card previews the MP4 on a loop (muted, so browsers
// allow autoplay); the buttons hand over the files.
import { useEffect, useRef, useState } from "react";
import { MOTION, type MotionClip } from "@/lib/data";
import Button from "@/components/ui/Button";
import { DownloadIcon } from "@/components/ui/icons";

function Clip({ clip }: { clip: MotionClip }) {
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

  const base = `/assets/motion/${clip.id}`;
  return (
    <figure className="m-0 flex flex-col gap-4">
      <div
        ref={stage}
        className="relative overflow-hidden rounded-2xl"
        style={{ background: clip.stage ?? "#ffffff", aspectRatio: clip.aspect }}
      >
        {near ? (
          <video
            src={`${base}.mp4`}
            poster={`${base}-poster.png`}
            autoPlay
            loop
            muted
            playsInline
            aria-label={clip.name}
            className={`absolute inset-0 h-full w-full ${clip.fit === "contain" ? "object-contain p-6" : "object-cover"}`}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`${base}-poster.png`}
            alt=""
            className={`absolute inset-0 h-full w-full ${clip.fit === "contain" ? "object-contain p-6" : "object-cover"}`}
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
  return (
    <section className="flex flex-col gap-16 px-edge pb-section pt-16">
      <div className="statement">
        <div className="grid grid-cols-2 gap-x-6 gap-y-14 max-[860px]:grid-cols-1">
          {MOTION.map((c) => (
            <Clip key={c.id} clip={c} />
          ))}
        </div>
      </div>
    </section>
  );
}

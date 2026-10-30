"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import { assetGeneratorUrl } from "@/lib/asset-generator";
import { InnerLines, OuterLines } from "./GridLines";
import Reveal from "./Reveal";

// Screen recordings from the Asset Generator landing page (tools.blueprintstudio.ai),
// each with its first frame as the poster, so the window never shows blank.
const CLIPS = [1, 2, 3].map((n) => ({ src: `/asset-generator/demo-${n}.mp4`, poster: `/asset-generator/demo-${n}.webp` }));

const APPS = [
  { name: "Claude", icon: "claude-spark-clay.svg" },
  { name: "ChatGPT", icon: "openai-blossom-black.svg" },
  { name: "Cursor", icon: "cursor-cube-2d-light.svg" },
  { name: "VS Code", icon: "vscode.svg" },
];

const BRAND_GRADIENT = "linear-gradient(95deg, #33A6F7 0%, #1472F6 52%, #444DEB 89%)";

// A browser window playing the generator, one clip after another. Clips load
// only once the band is near the screen, and pause when it leaves.
function DemoWindow() {
  const reduceMotion = useReducedMotion();
  const windowRef = useRef<HTMLDivElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const fills = useRef<(HTMLSpanElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = windowRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "120px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const video = videos.current[active];
    if (!video || reduceMotion) return;
    if (inView) video.play().catch(() => {});
    else video.pause();
  }, [active, inView, reduceMotion]);

  // Each tab fills as its clip plays.
  useEffect(() => {
    if (!inView || reduceMotion) return;
    let raf = 0;
    const tick = () => {
      fills.current.forEach((fill, i) => {
        if (!fill) return;
        const video = videos.current[i];
        const done = i === active && video?.duration ? video.currentTime / video.duration : 0;
        fill.style.transform = `scaleX(${done})`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, inView, reduceMotion]);

  const show = (next: number) => {
    if (next === active) return;
    videos.current[active]?.pause();
    const video = videos.current[next];
    if (video) video.currentTime = 0;
    setActive(next);
  };

  return (
    <div
      ref={windowRef}
      className="overflow-hidden rounded-[14px] border border-black/[0.08] bg-[#F5F5F5] shadow-[0_30px_60px_-24px_rgba(28,28,30,0.28),0_2px_6px_rgba(28,28,30,0.06)]"
    >
      <div className="flex h-8 items-center gap-3 border-b border-black/[0.06] bg-white/90 px-3">
        <div className="flex items-center gap-1.5">
          {CLIPS.map((clip, i) => (
            <button
              key={clip.src}
              type="button"
              onClick={() => show(i)}
              aria-label={`Play demo ${i + 1} of ${CLIPS.length}`}
              aria-pressed={i === active}
              className="group flex h-6 items-center"
            >
              <span className="relative block h-[4px] w-5 overflow-hidden rounded-full bg-neutral-300/70 transition-colors group-hover:bg-neutral-400">
                <span
                  ref={(el) => {
                    fills.current[i] = el;
                  }}
                  className="absolute inset-0 origin-left rounded-full bg-neutral-500"
                  style={{ transform: `scaleX(${reduceMotion && i === active ? 1 : 0})` }}
                />
              </span>
            </button>
          ))}
        </div>
        <span className="flex-1 truncate pr-[60px] text-center text-[11px] text-neutral-500">tools.blueprintstudio.ai</span>
      </div>
      <div className="relative aspect-[1248/720]">
        {CLIPS.map((clip, i) => (
          <video
            key={clip.src}
            ref={(el) => {
              videos.current[i] = el;
            }}
            src={clip.src}
            poster={clip.poster}
            muted
            playsInline
            preload="none"
            aria-hidden
            onEnded={() => show((i + 1) % CLIPS.length)}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out"
            style={{ opacity: i === active ? 1 : 0 }}
          />
        ))}
      </div>
    </div>
  );
}

export default function AssetGeneratorBand() {
  return (
    <Section className="relative flex flex-col bg-neutral-100">
      <OuterLines />
      <SectionHeader leftText="Our product" rightText="// tools.blueprintstudio.ai" />

      <OuterContainer>
        <InnerContainer className="relative px-2.5 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14">
          <InnerLines />

          <Reveal>
            <div className="grid overflow-hidden rounded-[24px] border border-neutral-300 bg-white lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="relative z-[1] flex flex-col justify-center p-6 sm:p-10 lg:py-14 lg:pl-12 lg:pr-4">
                <span className="w-fit rounded-full border border-neutral-300 bg-white px-3 py-1 text-[13px] font-medium text-neutral-700">
                  Blueprint Studio Asset Generator
                </span>
                <h2
                  className="mt-5 cursor-default font-medium text-neutral-800"
                  style={{ fontSize: "clamp(28px, 3vw, 38px)", lineHeight: 1.1, letterSpacing: "-0.03em", textWrap: "balance" }}
                >
                  Your brand&rsquo;s Styles and logos,{" "}
                  <span
                    style={{ backgroundImage: BRAND_GRADIENT, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}
                  >
                    in your AI&nbsp;app.
                  </span>
                </h2>
                <p className="mt-4 max-w-[44ch] text-[16px] leading-relaxed text-neutral-600" style={{ textWrap: "pretty" }}>
                  It remembers your brand, so image number fifty still looks like image number one. Make assets on the web, or
                  straight from the AI app you already&nbsp;use.
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <div aria-hidden className="flex shrink-0 -space-x-1.5">
                    {APPS.map((app) => (
                      <span
                        key={app.name}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`/asset-generator/apps/${app.icon}`} alt="" width={14} height={14} className="h-3.5 w-3.5" />
                      </span>
                    ))}
                  </div>
                  <p className="text-[14px] leading-snug text-neutral-500">Works with Claude, ChatGPT, Codex, Cursor and VS&nbsp;Code.</p>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <a
                    href={assetGeneratorUrl("/asset-generator/landing", "home_band")}
                    target="_blank"
                    rel="noopener"
                    data-track="cta_click"
                    data-track-cta="primary"
                    className="group relative flex h-11 items-center gap-2 overflow-hidden rounded-[12px] px-5 text-[15px] font-medium text-white transition-[filter] hover:brightness-110"
                    style={{
                      background: BRAND_GRADIENT,
                      boxShadow: "0 1px 2px rgba(0,0,0,0.1), 0 2px 8px rgba(51,166,247,0.3), inset 0 1px 0 rgba(255,255,255,0.25)",
                      textShadow: "0 1px 2px rgba(0,0,0,0.15)",
                    }}
                  >
                    Try it now
                    <ArrowUpRight
                      aria-hidden
                      className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                  <a
                    href={assetGeneratorUrl("/mcp-setup", "home_band")}
                    target="_blank"
                    rel="noopener"
                    data-track="cta_click"
                    data-track-cta="secondary"
                    className="group flex items-center gap-1.5 whitespace-nowrap text-[15px] font-medium text-neutral-700 transition-colors hover:text-neutral-900"
                  >
                    Connect your AI app
                    <ArrowRight aria-hidden className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
                  </a>
                </div>
                <p className="mt-4 text-[13px] text-neutral-500">Free to start: 500 credits for new accounts.</p>
              </div>

              {/* The product, on the landing page's meadow */}
              <div className="relative h-[320px] overflow-hidden sm:h-[460px] lg:h-auto lg:min-h-[480px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/asset-generator/meadow.webp"
                  alt=""
                  width={2000}
                  height={807}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-x-0 bottom-0 h-[82%] w-full object-cover object-[50%_80%]"
                  style={{
                    maskImage: "linear-gradient(to bottom, transparent, #000 55%)",
                    WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 55%)",
                  }}
                />
                <div aria-hidden className="absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-white to-transparent lg:block" />
                <div className="absolute left-5 right-[-48px] top-1/2 -translate-y-1/2 sm:left-10 sm:right-[-72px] lg:left-7 lg:right-[-96px]">
                  <DemoWindow />
                </div>
              </div>
            </div>
          </Reveal>
        </InnerContainer>
      </OuterContainer>
    </Section>
  );
}

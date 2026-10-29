"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import { Pause, Play } from "lucide-react";
import { portfolioProjects, type PortfolioProject, type MediaAsset, type ShowcaseMedia } from "@/data/portfolioData";

// Off the home page for now, to keep it shorter; their portfolio pages stay up.
const HIDDEN_ON_HOME = ['tokenworks', 'breeze'];
const portfolioSections = portfolioProjects.filter((p) => !HIDDEN_ON_HOME.includes(p.id));

// Portfolio videos stay unloaded until the hero reel has landed (it sends
// "bp:opening-landed"), so they don't compete with it. Then they load in page
// order, two at a time. A card that comes near the screen after that loads
// straight away.
type Waiter = { start: () => boolean; started: boolean }; // start: false if it took no slot
const waiting: Waiter[] = [];
const MAX_LOADING = 2;
let released = false;
let loading = 0;

function pump() {
  while (released && loading < MAX_LOADING) {
    const next = waiting.find((w) => !w.started);
    if (!next) return;
    next.started = true;
    if (next.start()) loading++;
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('bp:opening-landed', () => {
    released = true;
    pump();
  }, { once: true });
}

interface MediaCardProps {
  media: MediaAsset | ShowcaseMedia;
  title?: string;
  description?: string;
  aspectRatio: string;
  featured?: boolean;
  imageOnly?: boolean;
  isMobile?: boolean;
}

function MediaCard({ media, title, description, aspectRatio, featured = false, imageOnly = false, isMobile = false }: MediaCardProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const slotRef = useRef(false); // holds one of the MAX_LOADING slots

  useEffect(() => {
    const card = cardRef.current;
    if (!card || media.type !== 'video') return;
    const waiter: Waiter = {
      started: false,
      start: () => {
        // The phone or desktop copy that's hidden at this width: leave it to the
        // observer below, which loads it if a resize ever shows it.
        if (card.getClientRects().length === 0) {
          waiter.started = false;
          waiting.splice(waiting.indexOf(waiter), 1);
          return false;
        }
        slotRef.current = true;
        setShouldLoad(true);
        return true;
      },
    };
    waiting.push(waiter);
    pump();
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (waiter.started) return;
        // Near the screen while the reel is still landing (the first card sits
        // just under it): first in line, but it still waits for the reel.
        if (!released) {
          waiting.splice(waiting.indexOf(waiter), 1);
          waiting.unshift(waiter);
          return;
        }
        waiter.started = true; // jumps the queue without taking a slot
        setShouldLoad(true);
      },
      { rootMargin: '100% 0px' }
    );
    observer.observe(card);
    return () => {
      observer.disconnect();
      if (waiting.includes(waiter)) waiting.splice(waiting.indexOf(waiter), 1);
    };
  }, [media.type]);

  // Buffered enough (or gave up): hand the slot to the next video.
  const freeSlot = () => {
    if (!slotRef.current) return;
    slotRef.current = false;
    loading--;
    pump();
  };

  const togglePlayPause = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // const scaleClass = featured ? 'group-hover:scale-[1.0125]' : 'group-hover:scale-[1.025]';
  const scaleClass = ''; // Hover effect disabled

  return (
    <div ref={cardRef} className="relative cursor-default">
      <div className="group relative">
        <div
          className="bg-neutral-200 absolute left-0 top-0 w-full rounded-md"
          style={{ aspectRatio }}
        />
        <div className="relative mx-auto overflow-hidden transition-opacity duration-300 ease-out rounded-md">

          <div className="relative w-full" style={{ aspectRatio }}>
            {media.type === 'video' ? (
              <div
                className="absolute left-0 top-0 h-full w-full object-cover overflow-hidden"
                style={{ aspectRatio }}
              >
                <video
                  ref={videoRef}
                  src={shouldLoad ? media.src : undefined}
                  autoPlay
                  loop
                  playsInline
                  muted
                  preload="none"
                  poster={shouldLoad ? media.poster : undefined}
                  onCanPlayThrough={freeSlot}
                  onSuspend={freeSlot}
                  onError={freeSlot}
                  className={`pointer-events-none h-full w-full object-cover transition-transform duration-300 ${scaleClass}`}
                  onMouseEnter={() => setShowControls(true)}
                  onMouseLeave={() => setShowControls(false)}
                />
                {featured && (
                  <button
                    type="button"
                    onClick={togglePlayPause}
                    className={`absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-lg transition duration-200 hover:bg-black/60 cursor-pointer ${
                      showControls ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                  >
                    {isPlaying ? (
                      <Pause className="h-3 w-3" />
                    ) : (
                      <Play className="h-3 w-3" />
                    )}
                  </button>
                )}
              </div>
            ) : (
              <div className="h-full w-full">
                <div className="group relative h-full w-full overflow-hidden rounded-none bg-transparent transition-colors duration-300" style={{ aspectRatio }}>
                  <Image
                    alt={media.alt}
                    fill
                    sizes={featured ? "(max-width: 768px) 100vw, (max-width: 1024px) 75vw, 750px" : "(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 250px"}
                    quality={90}
                    className={`object-cover object-center transition-transform duration-300 ${scaleClass}`}
                    src={media.src}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Text content - completely separate from media container */}
      {featured && !imageOnly && title && description && (
        <div className="text-black relative w-full pt-8">
          <div className="text-xl md:text-2xl lg:text-3xl font-semibold mb-2 cursor-default">
            {title}
          </div>
          <p className="text-neutral-600 text-base cursor-default">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}

export default function PortfolioBento() {
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [spacerHeights, setSpacerHeights] = useState<number[]>(
    portfolioSections.map(() => 100)
  );

  const measureHeights = useCallback(() => {
    const heights = textRefs.current.map((ref) => {
      if (!ref || ref.offsetHeight === 0) return 100;
      // spacer needs to match text height minus the space-y-6 gap (24px)
      return Math.max(0, ref.offsetHeight - 24);
    });
    setSpacerHeights(heights);
  }, []);

  useEffect(() => {
    measureHeights();
    window.addEventListener("resize", measureHeights);
    return () => window.removeEventListener("resize", measureHeights);
  }, [measureHeights]);

  return (
    <Section className="flex flex-col relative z-20 bg-neutral-100">
      {/* Background lines matching existing portfolio */}
      <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
        <div className="w-full flex-1 flex justify-center relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
        </div>
      </div>

      <SectionHeader leftText="PORTFOLIO" rightText="design / dev" />

      <OuterContainer className="flex-1">
        <InnerContainer className="pt-8 sm:pt-12 lg:pt-16 px-2.5 sm:px-6 relative">
          {/* Inner dashed vertical lines on desktop - matching Achievements section */}
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          
          <h2
            className="font-medium text-black text-center mb:0 cursor-default"
            style={{
              fontSize: 'clamp(32px, 6vw, 48px)',
              lineHeight: 'clamp(97%, 1vw, 100%)',
              letterSpacing: '-1.5px'
            }}
          >
            Featured Work
          </h2>
        </InnerContainer>

        {/* Render all project sections sequentially */}
        <div className="w-full max-w-[1000px]">
          {portfolioSections.map((project, sectionIndex) => (
            <div key={project.id} className="w-full">
              {sectionIndex > 0 && (
                <div className="w-full line-dash-x" />
              )}
              
              <InnerContainer className="py-10 sm:py-16 lg:py-20 px-2.5 sm:px-6 relative">
                {/* Inner dashed vertical lines for each section */}
                <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
                <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />
                
                {/* Wrap entire section in clickable link - DISABLED */}
                {/* <a href={project.link} className="block cursor-pointer group/section transition-all duration-300 hover:opacity-90"> */}
                <div className="block">
                  <div className="lg:grid lg:grid-cols-4 lg:gap-6">
                    {/* Featured item - sticky positioned on desktop */}
                    <div className="lg:col-span-3 mb-0">
                      <div className="lg:sticky lg:top-24">
                        {/* Mobile version - 9:16 aspect ratio */}
                        <div className="block lg:hidden ">
                          <MediaCard
                            media={project.featuredMedia.mobile}
                            title={project.title}
                            description={project.description}
                            aspectRatio="2/3"
                            featured
                            isMobile
                          />

                          {/* Mobile: Show showcase images in a grid below */}
                          <div className="grid grid-cols-3 gap-2 mt-8">
                            {project.showcaseMedia.map((item) => (
                              <div key={item.id} className="relative">
                                <MediaCard media={item} aspectRatio="1/1" imageOnly />
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Desktop version - 16:9 aspect ratio */}
                        <div className="hidden lg:block lg:px-0">
                          <MediaCard
                            media={project.featuredMedia.desktop}
                            aspectRatio="16/9"
                            featured
                            imageOnly
                          />
                          <div
                            ref={(el) => { textRefs.current[sectionIndex] = el; }}
                            className="text-black relative w-full pt-8"
                          >
                            <div className="text-xl md:text-2xl lg:text-3xl font-semibold mb-2 cursor-default">
                              {project.title}
                            </div>
                            <p className="text-neutral-600 text-base cursor-default">
                              {project.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Showcase items - image only, desktop only */}
                    <div className="hidden lg:block lg:col-span-1 lg:px-0">
                      <div className="space-y-6">
                        {project.showcaseMedia.map((item) => (
                          <div key={item.id} className="relative">
                            <MediaCard media={item} aspectRatio="1/1" imageOnly />
                          </div>
                        ))}
                        {/* Spacer matches featured text height so showcase bottoms align with featured media bottom */}
                        <div style={{ height: spacerHeights[sectionIndex] ?? 100 }} />
                      </div>
                    </div>
                  </div>
                {/* </a> */}
                </div>
              </InnerContainer>
            </div>
          ))}
        </div>
      </OuterContainer>
      <div className="w-full line-dash-x" />
    </Section>
  );
}
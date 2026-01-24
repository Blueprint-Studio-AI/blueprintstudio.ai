"use client";

import { useRef, useEffect, useState } from "react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import { ArrowUpRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile (small phones only for vertical video)
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoaded = () => {
      setIsVideoLoaded(true);
      video.play().catch(console.error);
    };

    // Use canplaythrough for better iOS Safari support
    video.addEventListener("canplaythrough", handleLoaded);
    if (video.readyState >= 3) handleLoaded();

    return () => video.removeEventListener("canplaythrough", handleLoaded);
  }, [isMobile]);

  return (
    <Section className="relative z-20 bg-neutral-50 overflow-hidden min-h-fit">
      {/* Vertical lines */}
      <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
        <div className="w-full flex-1 flex justify-center relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
        </div>
      </div>

      <SectionHeader
        leftText="YC LAUNCH VIDEOS"
        centerContent={
          <Link href="/" className="hover:opacity-70 transition-opacity">
            <Image
              src="/blueprint-logo-dark.svg"
              alt="Blueprint Studio"
              width={80}
              height={20}
              className="h-3 sm:h-4 w-auto"
            />
          </Link>
        }
        rightText="// fast-track"
      />

      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="pt-2.5 sm:pt-20 lg:pt-28 pb-8 sm:pb-20 lg:pb-28 px-2.5 sm:px-6 relative">
          {/* Inner dashed lines */}
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

          {/* Content Grid - video first on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-10 items-center">
            {/* Left: Text Content - order-2 on mobile, order-1 on desktop */}
            <div className={`flex flex-col gap-6 order-2 lg:order-1 ${isMobile ? '-mt-20 relative z-10 bg-neutral-50/70 backdrop-blur-xl pt-6 px-4 w-full' : ''}`}>
              <h1
                className="font-medium text-black cursor-default"
                style={{
                  fontSize: "clamp(36px, 8vw, 64px)",
                  lineHeight: "105%",
                  letterSpacing: "-1.5px",
                }}
              >
                Your launch video in&nbsp;7&nbsp;days.
              </h1>

              <p
                className="text-neutral-600 cursor-default"
                style={{
                  fontSize: "clamp(16px, 2.5vw, 20px)",
                  lineHeight: "150%",
                }}
              >
                You focus on shipping. We&apos;ll handle the video. Studio
                quality, startup speed.
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-sm text-neutral-600 cursor-default">
                  100+ video projects delivered
                </span>
              </div>

              {/* CTA Button */}
              <button
                className="w-fit py-3 px-6 font-medium flex items-center justify-center bg-black text-white rounded-lg hover:bg-neutral-800 transition-all duration-200 text-sm group"
                onClick={() =>
                  window.open(
                    "https://cal.com/blueprint-studio/intro-call",
                    "_blank"
                  )
                }
              >
                <span>Book a Call</span>
                <ArrowUpRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>

            {/* Right: Video Reel - order-1 on mobile, order-2 on desktop */}
            <div className={`relative overflow-hidden bg-neutral-200 order-1 lg:order-2 w-full ${isMobile ? 'aspect-[3/4] rounded-lg' : 'aspect-video rounded-xl'}`}>
              <video
                ref={videoRef}
                key={isMobile ? 'mobile' : 'desktop'}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  opacity: isVideoLoaded ? 1 : 0,
                  transition: "opacity 300ms ease",
                }}
                loop
                muted
                playsInline
                autoPlay
                preload="auto"
              >
                <source
                  src={isMobile
                    ? "/media/highlight-reel/highlight-reel-vertical-004-compressed.mp4"
                    : "/media/highlight-reel/highlight-reel-horizontal-003-compressed.mp4"
                  }
                  type="video/mp4"
                />
              </video>
              {/* Placeholder while loading */}
              {!isVideoLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-neutral-400 text-sm">Loading reel...</div>
                </div>
              )}
            </div>
          </div>
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}

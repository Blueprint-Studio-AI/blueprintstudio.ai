"use client";

import { useRef, useEffect } from "react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import GradientButton from "@/components/ui/GradientButton";
import GradientText from "@/components/ui/GradientText";
import DeliverablePill from "@/components/ui/DeliverablePill";
import SocialProof from "@/components/ui/SocialProof";

const deliverables = [
  { num: "01", label: "Brand" },
  { num: "02", label: "Website" },
  { num: "03", label: "Deck" },
  { num: "04", label: "Video" },
];

const galleryImages = [
  { src: "/launch-assets/brand-identity_assets/brand-identity_UNI.png", alt: "UNI" },
  { src: "/launch-assets/brand-identity_assets/brand-identity_autara.png", alt: "Autara" },
  { src: "/launch-assets/brand-identity_assets/brand-identity_huch.png", alt: "Huch" },
];

function ImageTicker() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const speed = 0.7;

    const animate = () => {
      scrollPosition += speed;
      const halfWidth = scrollContainer.scrollWidth / 2;
      if (scrollPosition >= halfWidth) {
        scrollPosition = 0;
      }
      scrollContainer.scrollLeft = scrollPosition;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="relative w-full pb-12">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-neutral-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-neutral-50 to-transparent z-10 pointer-events-none" />
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-hidden"
        style={{ scrollBehavior: "auto" }}
      >
        {[...galleryImages, ...galleryImages].map((img, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[640px] sm:w-[860px] lg:w-[1200px] aspect-[4/1] relative rounded-xl overflow-hidden"
          >
            <Image src={img.src} alt={img.alt} fill className="object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HeroSection() {
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
        leftText="LAUNCH PACKAGE"
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
        rightText="// for founders"
      />

      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="pt-16 sm:pt-24 lg:pt-32 pb-0 px-2.5 sm:px-6 relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

          {/* Centered text content */}
          <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
            <h1 className="font-medium text-black cursor-default text-[clamp(32px,8vw,60px)] leading-[118%] tracking-[-2.5px]">
              Everything you<br/>need&nbsp;to&nbsp;
              <GradientText>launch</GradientText>.
            </h1>

            {/* Deliverables pills */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center items-center gap-2 sm:gap-3">
              {deliverables.map((item) => (
                <DeliverablePill key={item.num} num={item.num} label={item.label} />
              ))}
            </div>

            <div className="flex flex-col items-center text-center gap-4 sm:gap-6">
              {/* Social proof */}
              <SocialProof showDivider>
                <span className="font-medium text-neutral-900">25+</span> startups launched
              </SocialProof>

              <p className="text-neutral-500 cursor-default text-[clamp(14px,2vw,16px)] leading-[128%]">
                One team. One timeline. Six weeks.
                <br />
                Built by founders, for founders.
              </p>

              {/* CTA */}
              <GradientButton
                className="w-full"
                onClick={() => window.open("https://cal.com/blueprint-studio/intro-call", "_blank")}
              >
                Book a Call
                <ArrowUpRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </GradientButton>
            </div>
           
          </div>

          {/* Scrolling image gallery */}
          <div className="mt-12 sm:mt-20">
            <ImageTicker />
          </div>
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />
    </Section>
  );
}

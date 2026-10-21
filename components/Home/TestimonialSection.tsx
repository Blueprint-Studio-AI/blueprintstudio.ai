"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import { HRule, InnerLines, OuterLines } from "./GridLines";
import Reveal, { EASE_OUT } from "./Reveal";

type Testimonial = {
  quote: string;
  author: string;
  role: string;
  company: string;
  image?: string;
  /** The opening words to set in ink when this quote leads. */
  lead?: string;
};

const featured: Testimonial = {
  quote:
    "Blueprint reduced the time it takes to explain our business from three minutes to 30 seconds. This helped us gain valuable partnerships and create marketing materials that resonate with our audience. Blueprint offers reliable, professional, and speedy service that takes the guesswork out of your public-facing operations.",
  lead: "Blueprint reduced the time it takes to explain our business from three minutes to 30 seconds.",
  author: "Alex Escudero",
  role: "Co-Founder",
  company: "Project Metavision",
};

const pair: Testimonial[] = [
  {
    quote:
      "Blueprint's design subscription gave us an affordable way to bring our digital vision to life. Their relentless dedication and talent accelerated our progress tremendously. Blueprint's blend of design talent and cutting edge ai expertise is truly unique and highly valuable.",
    author: "Andrew Jenkins",
    role: "Former VP of Engineering, Credit Karma",
    company: "Currently Startup Co-Founder",
  },
  {
    quote:
      "What sets Blueprint apart is the quality of their end-to-end design and engineering work. They quickly understood what we needed and made collaboration with our internal team feel effortless. Blueprint is absolutely the perfect fit for a lean, design-forward business that values both aesthetics and function!",
    author: "Shina Foo",
    role: "Head of Growth",
    company: "Perena",
    image: "/testimonials/shina-foo-perena.jpg",
  },
];

const more: Testimonial[] = [
  {
    quote:
      "Design or strategy needs? Check out Blueprint. They're a really capable team with an impressive background and confidence in their craft. We've been working with them the last two months and continue to do so.",
    author: "Scott Zimmer",
    role: "Former EVP of Innovation, Truist Bank",
    company: "Currently Startup Co-Founder",
  },
  {
    quote:
      "Blueprint helped us turn our ideas into focused, effective marketing materials. They were fast, responsive, and the quality speaks for itself. We'll definitely be working with them again.",
    author: "Ali Khalatpour",
    role: "Founder",
    company: "Piris Labs",
    image: "/testimonials/ali-khalatpour.png",
  },
  {
    quote:
      "Blueprint has been an invaluable partner for our service design efforts. Tyler and his team bring a unique blend of creativity, expertise, and professionalism to every project. They consistently deliver innovative solutions that not only meet our business goals but also exceed our expectations.",
    author: "Mauricio Manhaes",
    role: "President",
    company: "SDN Academic Task Force",
  },
  {
    quote:
      "Blueprint's ability to deeply understand our needs and translate them into smart solutions was an absolute home run.",
    author: "Steven Luis Howell",
    role: "CEO & Co-Founder",
    company: "Project Metavision",
  },
];

function Avatar({ t, size }: { t: Testimonial; size: number }) {
  if (t.image)
    return (
      <Image
        src={t.image}
        alt=""
        width={size}
        height={size}
        className="shrink-0 rounded-full object-cover shadow-[0_0_0_1px_rgba(0,0,0,0.06)]"
        style={{ width: size, height: size }}
      />
    );
  const initials = t.author
    .split(" ")
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-white text-[12px] font-medium tracking-[0.02em] text-neutral-500"
      style={{ width: size, height: size }}
    >
      {initials}
    </span>
  );
}

function Attribution({ t, size = 40 }: { t: Testimonial; size?: number }) {
  return (
    <figcaption className="mt-6 flex items-center gap-3">
      <Avatar t={t} size={size} />
      <div className="min-w-0 text-[14px] leading-snug" style={{ textWrap: "balance" }}>
        <p className="font-medium text-neutral-800">{t.author}</p>
        <p className="text-neutral-500">{t.role}</p>
        <p className="text-neutral-500">{t.company}</p>
      </div>
    </figcaption>
  );
}

function Quote({ t }: { t: Testimonial }) {
  return (
    <figure className="flex h-full flex-col px-2.5 py-10 sm:px-6 sm:py-12 lg:px-10">
      <blockquote className="flex-1 text-[17px] leading-[1.55] tracking-[-0.01em] text-neutral-700" style={{ textWrap: "pretty" }}>
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <Attribution t={t} />
    </figure>
  );
}

// Two quotes side by side, divided by a dashed rule on wide screens.
function Row({ items }: { items: Testimonial[] }) {
  return (
    <div className="relative grid md:grid-cols-2">
      <div aria-hidden className="line-dash-y absolute bottom-0 left-1/2 top-0 hidden md:block" />
      {items.map((t, i) => (
        <div key={t.author}>
          {i > 0 && (
            <div className="md:hidden">
              <HRule />
            </div>
          )}
          <Quote t={t} />
        </div>
      ))}
    </div>
  );
}

export default function TestimonialSection() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const rest = featured.quote.slice(featured.lead?.length ?? 0);

  return (
    <Section className="relative flex flex-col bg-neutral-100">
      <OuterLines />
      <SectionHeader leftText="Testimonials" rightText="// proven" />

      <OuterContainer>
        <InnerContainer className="relative px-0">
          <InnerLines />

          <Reveal className="px-2.5 pb-12 pt-14 text-center sm:px-6 sm:pb-14 sm:pt-20">
            <h2
              className="cursor-default font-medium text-neutral-800"
              style={{ fontSize: "clamp(32px, 4.4vw, 48px)", lineHeight: 1.05, letterSpacing: "-0.035em" }}
            >
              What founders say
            </h2>
          </Reveal>

          <HRule />

          {/* The lead quote, its first line in ink */}
          <Reveal>
            <figure className="px-2.5 py-12 sm:px-6 sm:py-16 lg:px-10">
              <blockquote
                className="cursor-default font-medium"
                style={{ fontSize: "clamp(20px, 2.5vw, 30px)", lineHeight: 1.3, letterSpacing: "-0.025em", textWrap: "pretty" }}
              >
                <span className="text-neutral-800">&ldquo;{featured.lead}</span>
                <span className="text-[#767B83]">{rest}&rdquo;</span>
              </blockquote>
              <Attribution t={featured} size={44} />
            </figure>
          </Reveal>

          <HRule />
          <Reveal>
            <Row items={pair} />
          </Reveal>
          <HRule />

          {/* The rest, on request: the page scrolls as normal throughout */}
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id="more-testimonials"
                key="more"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={reduceMotion ? { duration: 0 } : { height: { duration: 0.6, ease: EASE_OUT }, opacity: { duration: 0.4 } }}
                className="overflow-hidden"
              >
                <Row items={more.slice(0, 2)} />
                <HRule />
                <Row items={more.slice(2)} />
                <HRule />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-center px-2.5 py-8 sm:py-10">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="more-testimonials"
              className="group flex h-10 items-center gap-2 rounded-full border border-neutral-300 bg-white px-5 text-[14px] font-medium text-neutral-800 transition-colors hover:border-neutral-400"
            >
              {open ? "Show fewer" : `Read ${more.length} more`}
              <ChevronDown
                aria-hidden
                className={`h-4 w-4 text-neutral-500 transition-transform duration-500 ease-out ${open ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </InnerContainer>
      </OuterContainer>

      <div aria-hidden className="line-dash-x" />
    </Section>
  );
}

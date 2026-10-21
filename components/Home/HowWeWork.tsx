"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import { InnerLines, OuterLines } from "./GridLines";
import BookCallButton from "./BookCallButton";
import Reveal from "./Reveal";

// Prices and scopes as /brand, /launch and /launch-videos state them.
const projects = [
  {
    name: "Brand Identity",
    href: "/brand",
    scope: "Logo system, design system, social kit and AI prompts.",
    price: "$18–23K",
    time: "3–4 weeks",
  },
  {
    name: "Full Launch",
    href: "/launch",
    scope: "Brand, website, pitch deck and launch video. Add product design and an MVP.",
    price: "$50–120K",
    time: "6–12 weeks",
  },
  {
    name: "Launch Video",
    href: "/launch-videos",
    scope: "Script, production and the final cut, on a fast or a studio timeline.",
    price: "$8–15K",
    time: "10 days–4 weeks",
  },
];

// As the FAQ and the old pricing card describe the subscription.
const covered = ["UI/UX design", "Web development", "Mobile apps", "Branding", "Maintenance", "Project manager"];

const cadence = [
  { title: "Requests", detail: "Unlimited" },
  { title: "Updates", detail: "Every 48 hours" },
  { title: "Sync call", detail: "Every week" },
];

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-medium uppercase tracking-[0.02em] text-neutral-500">{children}</p>;
}

function Price({ lead, amount, unit }: { lead?: string; amount: string; unit: string }) {
  return (
    <p className="mt-7 flex items-baseline gap-2 text-neutral-800">
      {lead && <span className="text-[15px] text-neutral-500">{lead}</span>}
      <span className="text-[34px] font-medium leading-none tabular-nums tracking-[-0.03em] sm:text-[40px]">{amount}</span>
      <span className="text-[15px] text-neutral-500">{unit}</span>
    </p>
  );
}

function ColumnHead({ title, fit }: { title: string; fit: string }) {
  return (
    <>
      <h3 className="text-[26px] font-medium leading-tight tracking-[-0.03em] text-neutral-800 sm:text-[28px]">{title}</h3>
      <p className="mt-2 max-w-[36ch] text-[16px] leading-snug text-neutral-600" style={{ textWrap: "pretty" }}>
        {fit}
      </p>
    </>
  );
}

// The three beats of a partnership week, on a dashed rule. A small dot walks the
// rule while it's on screen, like a request moving through the queue.
function Cadence() {
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -15% 0px" });
  const reduceMotion = useReducedMotion();
  return (
    <ol ref={ref} className="relative grid grid-cols-3 gap-3">
      {/* Rule from the first dot to the last */}
      <div aria-hidden className="absolute left-[5px] right-[calc(33.333%_-_5.5px_-_0.5rem)] top-[5px] h-px">
        <div className="line-dash-x" />
        {!reduceMotion && (
          <motion.span
            className="absolute -top-[2.5px] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#1472F6]"
            initial={{ left: "0%", opacity: 0 }}
            animate={inView ? { left: ["0%", "0%", "50%", "50%", "100%", "100%"], opacity: [0, 1, 1, 1, 1, 0] } : undefined}
            transition={{ duration: 4.8, times: [0, 0.08, 0.38, 0.5, 0.8, 1], ease: [0.65, 0, 0.35, 1], repeat: Infinity, repeatDelay: 0.6 }}
          />
        )}
      </div>
      {cadence.map((step) => (
        <li key={step.title} className="relative">
          <span aria-hidden className="relative z-[1] block h-[11px] w-[11px] rounded-full border border-neutral-300 bg-white" />
          <p className="mt-3 text-[15px] font-medium text-neutral-800">{step.title}</p>
          <p className="mt-0.5 text-[13px] leading-snug text-neutral-500">{step.detail}</p>
        </li>
      ))}
    </ol>
  );
}

export default function HowWeWork() {
  return (
    <div id="how-we-work">
      <Section className="relative flex flex-col bg-neutral-100">
        <OuterLines />
        <SectionHeader leftText="How we work" rightText="// two ways" />

        <OuterContainer>
          <InnerContainer className="relative px-2.5 pb-14 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:pb-24">
            <InnerLines />

            <Reveal className="mx-auto mb-10 max-w-[640px] text-center sm:mb-14">
              <h2
                className="cursor-default font-medium text-neutral-800"
                style={{ fontSize: "clamp(32px, 4.4vw, 48px)", lineHeight: 1.05, letterSpacing: "-0.035em" }}
              >
                How we work
              </h2>
              <p
                className="mx-auto mt-4 max-w-[46ch] cursor-default text-neutral-600"
                style={{ fontSize: "clamp(16px, 1.4vw, 19px)", lineHeight: 1.4, letterSpacing: "-0.01em", textWrap: "balance" }}
              >
                Hire us for one project, or keep us on as your design and build team. Same senior team either&nbsp;way.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="overflow-hidden rounded-[24px] border border-neutral-300 bg-white">
                <div className="grid lg:grid-cols-2">
                  {/* Projects */}
                  <div className="flex flex-col p-6 sm:p-10">
                    <ColumnHead title="Projects" fit="For a one-time launch, with a defined scope, timeline and price." />
                    <Price lead="From" amount="$8K" unit="per project" />

                    <ul className="mt-8 border-t border-neutral-200">
                      {projects.map((project) => (
                        <li key={project.href} className="border-b border-neutral-200 last:border-b-0">
                          <Link
                            href={project.href}
                            className="group grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-1 py-4 sm:py-5"
                          >
                            <span className="flex items-center gap-1.5 text-[17px] font-medium tracking-[-0.01em] text-neutral-800">
                              {project.name}
                              <ArrowRight
                                aria-hidden
                                className="h-3.5 w-3.5 text-neutral-400 transition-[transform,color] duration-300 ease-out group-hover:translate-x-1 group-hover:text-neutral-800"
                              />
                            </span>
                            <span className="text-right text-[17px] font-medium tabular-nums tracking-[-0.01em] text-neutral-800">
                              {project.price}
                            </span>
                            <span className="text-[14px] leading-snug text-neutral-500">{project.scope}</span>
                            <span className="whitespace-nowrap text-right text-[14px] leading-snug text-neutral-500">{project.time}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Partnership */}
                  <div className="flex flex-col border-t border-neutral-200 p-6 sm:p-10 lg:border-l lg:border-t-0">
                    <ColumnHead title="Partnership" fit="For ongoing design and development, at a predictable monthly cost." />
                    <Price amount="$15K+" unit="per month" />

                    <div className="mt-8 border-t border-neutral-200 pt-6">
                      <Label>What it covers</Label>
                      <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2.5 sm:gap-x-6">
                        {covered.map((item) => (
                          <li key={item} className="flex items-start gap-2 whitespace-nowrap sm:gap-2.5 text-[14px] leading-snug text-neutral-700 sm:text-[15px]">
                            <Check aria-hidden strokeWidth={2.5} className="mt-[3px] h-3.5 w-3.5 shrink-0 text-[#1472F6]" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-7">
                      <Label>Cadence</Label>
                      <div className="mt-4">
                        <Cadence />
                      </div>
                    </div>

                    <p className="mt-7 text-[14px] leading-relaxed text-neutral-500" style={{ textWrap: "balance" }}>
                      Starts within 48 hours. Pause when the queue is empty, or cancel anytime, with no long&#8209;term&nbsp;commitment.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-5 border-t border-neutral-200 bg-neutral-50 p-6 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-6">
                  <p className="max-w-[52ch] text-[15px] leading-snug text-neutral-500" style={{ textWrap: "pretty" }}>
                    <span className="font-medium text-neutral-800">Not sure which fits?</span> Many teams start with a project
                    and move to the partnership after launch. Book a call and we&apos;ll scope it&nbsp;together.
                  </p>
                  <BookCallButton className="self-stretch sm:self-auto" />
                </div>
              </div>
            </Reveal>
          </InnerContainer>
        </OuterContainer>

        <div aria-hidden className="line-dash-x" />
      </Section>
    </div>
  );
}

"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "@/components/ui/SectionHeader";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "What if I only need some of the deliverables?",
    answer: (
      <>
        We offer{" "}
        <Link
          href="/brand"
          className="underline hover:text-neutral-900 transition-colors"
        >
          Brand Identity
        </Link>{" "}
        and{" "}
        <Link
          href="/launch-videos"
          className="underline hover:text-neutral-900 transition-colors"
        >
          Launch Videos
        </Link>{" "}
        as standalone packages. But if you need most of the bundle, the Launch
        Package is better value and you get a fully aligned team.
      </>
    ),
  },
  {
    question: "Can the timeline be faster?",
    answer:
      "Sometimes. If your deadline is tight, let's talk. We've delivered full launches in 4 weeks when needed — it just requires fast feedback on your end.",
  },
  {
    question: "What if I already have a brand or website?",
    answer:
      "We can work with existing assets. If your brand is solid, we'll build around it. If your site just needs a refresh, we'll scope accordingly. Price may adjust — let's discuss on a call.",
  },
  {
    question: "What tech stack do you use for websites?",
    answer:
      "Framer for marketing sites, or Next.js/Astro for custom builds. All are modern, fast, and optimized for performance. We'll recommend the best fit based on your needs.",
  },
  {
    question: "Do you write the pitch deck copy?",
    answer:
      "We develop the narrative structure and key messaging together. You provide the core content (product details, traction, team bios, financials). We shape it into a compelling story and design it in Figma.",
  },
  {
    question: "What about the launch video script?",
    answer:
      "We write it. You review and approve. We've written 100+ scripts for YC founders — we know what works.",
  },
  {
    question: "What are the AI prompts?",
    answer:
      "Pre-configured prompts for ChatGPT, Claude, and Midjourney trained on your brand voice and guidelines. Use them to draft copy, generate visuals, or stay consistent as you scale. They're yours to keep.",
  },
  {
    question: "What happens after launch?",
    answer: (
      <>
        Many clients move to our{" "}
        <Link
          href="/"
          className="underline hover:text-neutral-900 transition-colors"
        >
          monthly partnership
        </Link>{" "}
        for ongoing design, development, and iteration. But there&apos;s no
        obligation — the Launch Package is complete on its own.
      </>
    ),
  },
  {
    question: "What do you need from me?",
    answer:
      "A 1-hour kickoff call, access to your product (live app, Figma, or repo), existing assets if any, and responsive communication when we need decisions. We move fast; you'll need to keep pace.",
  },
];

interface FaqItemProps {
  question: string;
  answer: ReactNode;
}

function FaqItem({ question, answer }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-start py-6 text-left group"
        aria-expanded={isOpen}
      >
        <h4
          className="font-medium text-lg pr-8 text-black group-hover:text-neutral-600 transition-colors"
          style={{ textWrap: "balance" }}
        >
          {question}
        </h4>
        <motion.div
          className="shrink-0 w-8 h-8 rounded-full bg-neutral-100 border border-neutral-300 flex items-center justify-center group-hover:bg-neutral-200 transition-colors"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-neutral-600" />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div
          className="text-neutral-600 leading-relaxed pb-6"
          style={{ textWrap: "balance" }}
        >
          {answer}
        </div>
      </motion.div>
    </div>
  );
}

export default function FAQSection() {
  return (
    <Section className="flex flex-col relative z-20 bg-neutral-100 overflow-hidden">
      {/* Vertical lines */}
      <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
        <div className="w-full flex-1 flex justify-center relative">
          <div className="absolute left-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
        </div>
      </div>

      <SectionHeader leftText="FAQ" rightText="// clarity" />

      {/* Main Content */}
      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="pt-8 sm:pt-12 lg:pt-16 pb-8 sm:pb-12 lg:pb-16 px-2.5 md:px-6 relative">
          {/* Inner dashed vertical lines on desktop */}
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />

          {/* FAQ Container */}
          <div className="max-w-3xl px-2 md:mx-auto">
            {/* Title */}
            <div className="text-center mb-12">
              <h2
                className="font-medium text-black mb-4 cursor-default"
                style={{
                  fontSize: "clamp(32px, 6vw, 48px)",
                  lineHeight: "110%",
                  letterSpacing: "-1px",
                  textWrap: "balance",
                }}
              >
                Frequently Asked Questions
              </h2>
            </div>

            {/* FAQ Items */}
            <div>
              {faqs.map((faq, index) => (
                <FaqItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </InnerContainer>
      </OuterContainer>

      <div className="w-full line-dash-x" />

      {/* Spacer to create double line effect */}
      <div className="bg-neutral-100 py-4 sm:py-6 lg:py-8">
        <div className="w-full line-dash-x" />
      </div>
    </Section>
  );
}

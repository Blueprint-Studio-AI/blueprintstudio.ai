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
    question: "What if I already have a logo?",
    answer:
      "We can work with what you have. If it's solid, we'll build the system around it. If it needs refinement, we'll propose updates. Either way, you'll get the full identity system.",
  },
  {
    question: "What's a Brand GPT?",
    answer:
      "A custom AI trained on your brand voice, messaging, and guidelines. Use it to draft copy, check tone, onboard teammates, or stay consistent as you scale. It's yours to keep.",
  },
  {
    question: 'What are the "applications of choice"?',
    answer:
      "After the core deliverables, you pick 2-3 extras: pitch deck template, app icon, merch mockups, investor one-pager, event graphics, or something else. We've done this enough to know every founder has different needs.",
  },
  {
    question: "How many revisions are included?",
    answer:
      "Two rounds of revisions at each phase. We've never needed more, but if scope expands significantly, we'll discuss.",
  },
  {
    question: "What do you need from me to get started?",
    answer:
      "A 1-hour kickoff call, access to any existing brand assets, examples of brands you admire, and quick responses when we have questions.",
  },
  {
    question: "What if I need a website too?",
    answer: (
      <>
        Check out our{" "}
        <Link
          href="/launch"
          className="underline hover:text-neutral-900 transition-colors"
        >
          Full Launch
        </Link>{" "}
        package — it includes brand identity plus website, pitch deck, and
        launch video starting at $50K.
      </>
    ),
  },
  {
    question: "Do you offer ongoing support?",
    answer: (
      <>
        Yes. Many clients move to our{" "}
        <Link
          href="/"
          className="underline hover:text-neutral-900 transition-colors"
        >
          $15K/mo partnership
        </Link>{" "}
        after launch for ongoing design, development, and iteration.
      </>
    ),
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

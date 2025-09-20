"use client";
import { useState } from "react";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "../ui/SectionHeader";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "How does the subscription model work?",
    answer: "Our subscription model provides you with a dedicated team of designers and developers on a monthly basis. You get unlimited requests, revisions, and consistent delivery without the overhead of hiring full-time staff. You can pause or cancel anytime with no long-term commitments."
  },
  {
    question: "What's included in the subscription?",
    answer: "Everything you need for digital success: UI/UX design, web development, mobile apps, branding, and ongoing maintenance. You'll have access to senior-level talent across all disciplines, a dedicated project manager, and our streamlined collaboration platform."
  },
  {
    question: "How quickly can you start on my project?",
    answer: "We can typically start within 48 hours of signing up. For subscription clients, you'll get immediate access to our platform where you can start submitting requests right away. Project-based work begins after a brief onboarding call to understand your specific needs."
  },
  {
    question: "What if I'm not satisfied with the work?",
    answer: "We offer unlimited revisions until you're 100% satisfied. Our iterative process ensures we're aligned with your vision from the start, but we'll keep refining until it's perfect. For new clients, we also offer a 7-day trial period."
  },
  {
    question: "Can I pause or cancel my subscription?",
    answer: "Yes, you have complete flexibility. Pause your subscription when you don't have active projects and resume when you're ready. Cancel anytime with no penalties or hidden fees. We believe in earning your business every month."
  },
  {
    question: "How do you handle communication and project management?",
    answer: "You'll have a dedicated Slack channel, weekly sync calls, and access to our project management platform. We believe in transparent, asynchronous communication that respects your time while keeping you fully informed of progress."
  },
  {
    question: "What's the difference between subscription and project pricing?",
    answer: "Subscriptions are ideal for ongoing needs with predictable monthly costs and unlimited requests. Project pricing works better for one-time initiatives with defined scope and timeline. Both include the same high-quality team and deliverables."
  },
  {
    question: "Do you work with enterprises or just startups?",
    answer: "We work with companies of all sizes. From solo founders needing their first website to Fortune 500 companies requiring enterprise solutions. Our flexible model and experienced team can scale to meet any requirement."
  }
];

interface FaqItemProps {
  question: string;
  answer: string;
  isLast?: boolean;
}

function FaqItem({ question, answer, isLast = false }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-start py-6 text-left group"
        aria-expanded={isOpen}
      >
        <h4 className="font-medium text-lg pr-8 text-black group-hover:text-neutral-600 transition-colors">
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
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="text-neutral-600 leading-relaxed pb-6">
          {answer}
        </p>
      </motion.div>
    </div>
  );
}

export default function FAQSection() {
  return (
    <Section className="flex flex-col relative z-20 bg-neutral-100 overflow-hidden">
      {/* Artificial vertical lines to match the background */}
      <div className="absolute inset-0 flex justify-center pointer-events-none px-2.5 sm:px-[60px]">
        <div className="w-full flex-1 flex justify-center relative">
          {/* Left dashed vertical line (mobile) / solid line (desktop) */}
          <div className="absolute left-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
          
          {/* Right dashed vertical line (mobile) / solid line (desktop) */}
          <div className="absolute right-0 top-0 bottom-0 line-dash-y custom:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-neutral-300 hidden custom:block" />
        </div>
      </div>

      <SectionHeader leftText="FAQ" rightText="⋯ answers / clarity" />

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
              <h2 className="font-medium text-black mb-4" 
                  style={{ 
                    fontSize: 'clamp(32px, 6vw, 48px)', 
                    lineHeight: '110%',
                    letterSpacing: '-1px' 
                  }}>
                Frequently Asked Questions
              </h2>
              <p className="text-neutral-600 text-lg">
                Everything you need to know about working with Blueprint Studio
              </p>
            </div>

            {/* FAQ Items */}
            <div>
              {faqs.map((faq, index) => (
                <FaqItem 
                  key={index} 
                  question={faq.question} 
                  answer={faq.answer}
                  isLast={index === faqs.length - 1}
                />
              ))}
            </div>

            {/* Contact CTA */}
            <div className="text-center mt-12 pt-8">
              <p className="text-neutral-600 mb-4">
                Still have questions?
              </p>
              <a 
                href="mailto:blueprint.dao@gmail.com" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-neutral-800 transition-colors text-sm font-medium"
              >
                Get in touch
              </a>
            </div>
          </div>
        </InnerContainer>
      </OuterContainer>
      
      <div className="w-full line-dash-x"/>
    </Section>
  );
}
// components/PricingSection.tsx
"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowUpRight, ChevronDown } from 'lucide-react';
import Script from 'next/script';
import Head from 'next/head';

// For SVGs, we'll use regular img tags instead of Next.js Image component
const previewImages = {
  calendar: "data:image/svg+xml,%3Csvg width='200' height='150' viewBox='0 0 200 150' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='200' height='150' fill='%23F3F4F6'/%3E%3Crect x='20' y='20' width='160' height='110' rx='4' fill='white'/%3E%3Crect x='30' y='40' width='140' height='20' rx='2' fill='%23E5E7EB'/%3E%3Crect x='30' y='70' width='140' height='20' rx='2' fill='%23E5E7EB'/%3E%3Crect x='30' y='100' width='140' height='20' rx='2' fill='%23E5E7EB'/%3E%3C/svg%3E",
  chat: "data:image/svg+xml,%3Csvg width='200' height='150' viewBox='0 0 200 150' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='200' height='150' fill='%23F3F4F6'/%3E%3Crect x='20' y='20' width='160' height='110' rx='4' fill='white'/%3E%3Crect x='30' y='90' width='140' height='30' rx='15' fill='%23E5E7EB'/%3E%3Crect x='30' y='40' width='100' height='20' rx='10' fill='%23E5E7EB'/%3E%3C/svg%3E"
};

const subscriptionFeatures = [
  {
    title: "Dedicated team",
    description: "Full-time designers and developers"
  },
  {
    title: "Unlimited requests",
    description: "Submit as many projects as you need"
  },
  {
    title: "Priority support",
    description: "24/7 access to your project manager"
  },
  {
    title: "Rapid delivery",
    description: "Regular updates and deployments"
  }
];

const projectFeatures = [
  {
    title: "Custom scope & timeline",
    description: "Tailored to your specific needs"
  },
  {
    title: "Fixed pricing",
    description: "No surprises or hidden fees"
  },
  {
    title: "Project management",
    description: "Dedicated project lead"
  },
  {
    title: "Flexible options",
    description: "Select package or build your own"
  }
];

const pricingFaqs = [
    {
      question: "How flexible is the subscription?",
      answer: "Our company subscriptions are highly flexible. You can pause or cancel at any time, and adjust your team size and resource allocation monthly based on your needs."
    },
    {
      question: "What determines the subscription cost?",
      answer: "Pricing varies based on the services and resources needed. Development-intensive projects with multiple developers typically represent the higher end of our range, while marketing-focused engagements often start at lower price points. We'll help determine the right resource mix for your company."
    },
    {
      question: "Can we scale our subscription up or down?",
      answer: "Yes, your company can adjust bandwidth monthly. Need more developers for a big launch? Want to scale back after a major milestone? You have full control over your resource allocation and can modify it based on project demands."
    },
    {
      question: "How does the trial period work?",
      answer: "New companies can start with a 1-week trial period to experience our full service offering. During this time, you'll work with our team just as you would in a regular subscription, allowing you to evaluate if we're the right fit for your needs."
    },
    {
      question: "What happens if we need to pause our subscription?",
      answer: "We understand business needs fluctuate. You can pause your company's subscription at any time and resume when ready, maintaining all your project information and team relationships."
    },
    {
      question: "How do you handle project handoffs and documentation?",
      answer: "Our team provides comprehensive documentation and ensures smooth knowledge transfer for all company projects. Whether you're scaling up or transitioning between phases, we maintain detailed records and clear communication."
    },
    {
      question: "What's the difference between subscription and custom projects?",
      answer: "Subscriptions offer ongoing access to our team with predictable monthly pricing, ideal for companies looking for a consistent partner. Custom projects are better for one-off initiatives with defined scopes and timelines."
    }
  ];

  interface FaqItemProps {
    question: string;
    answer: string;
  }

// Add a new FAQ item component
function FaqItem({ question, answer }: FaqItemProps) {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <div className="border-b border-gray-100 last:border-0">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-start py-6 text-left group"
          aria-expanded={isOpen}
        >
          <h4 className="font-medium text-lg pr-8 group-hover:text-gray-600 transition-colors">
            {question}
          </h4>
          <motion.div 
            className="shrink-0 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            >
            <ChevronDown className="w-5 h-5 text-gray-600" />
            </motion.div>
        </button>
        <div 
          className={`grid transition-all duration-200 ease-in-out ${
            isOpen ? 'grid-rows-[1fr] opacity-100 mb-6' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <p className="text-gray-600 leading-relaxed max-w-3xl">
              {answer}
            </p>
          </div>
        </div>
      </div>
    );
  }
export function PricingSection() {
  const [showCalendarPreview, setShowCalendarPreview] = useState(false);
  const [showChatPreview, setShowChatPreview] = useState(false);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": pricingFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
    {/* Add Schema Script */}
    <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema)
          }}
        />
      </Head>

    <section id="pricing" className="py-32 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-gray-600">
            Choose the engagement model that works&nbsp;best&nbsp;for&nbsp;you
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Subscription Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative group"
          >
            <div className="bg-black text-white p-8 rounded-2xl">
              <div className="absolute -top-3 -right-3">
                <span className="inline-flex items-center bg-blue-500 text-white text-sm px-3 py-1 rounded-full">
                 1-Week Free Trial
                </span>
              </div>

              <h3 className="text-2xl font-semibold mb-2">Design & Build Subscription</h3>
              <div className="text-3xl font-bold mb-4">
                $5k - $20k<span className="text-lg font-normal">/month</span>
              </div>
              <p className="text-gray-400 mb-6">All-inclusive service with dedicated team</p>
              
              <ul className="space-y-4 mb-8">
                {subscriptionFeatures.map((feature, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                    <div>
                      <p className="font-medium">{feature.title}</p>
                      <p className="text-gray-400 text-sm">{feature.description}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>

              <button 
              className="w-full bg-white text-black rounded-full py-4 font-medium flex items-center justify-center group-hover:bg-gray-100 transition-colors"
              onMouseEnter={() => setShowCalendarPreview(true)}
              onMouseLeave={() => setShowCalendarPreview(false)}
              onClick={() => window.open('https://cal.com/blueprint-studio/intro-call', '_blank')}
            >
              <span>Book a Call</span>
              <ArrowUpRight className="w-5 h-5 ml-2 text-gray-300 group-hover:text-black transition-colors" />
            </button>

              {/* Calendar Preview */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: showCalendarPreview ? 1 : 0,
                  y: showCalendarPreview ? 0 : 10
                }}
                className="absolute top-[calc(100%-12px)] left-[26%] -translate-x-1/2 bg-white text-black p-6 rounded-xl shadow-xl w-48 pointer-events-none z-10"
              >
                <div className="relative">
                  <div className="absolute top-0.5 right-0.5 w-6 h-6 bg-black rounded-full flex items-center justify-center -mt-3 -mr-3 z-20">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                  <img 
                    src={previewImages.calendar}
                    alt="Calendar Interface"
                    className="w-full h-auto rounded-lg mb-2"
                  />
                  <p className="text-xs text-gray-600 text-center mt-4">Select a time</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Custom Project Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative group"
          >
            <div className="border border-gray-200 p-8 rounded-2xl bg-white">
              <h3 className="text-2xl font-semibold mb-2">Project-Based</h3>
              <div className="text-3xl font-bold mb-4">Get Instant Quote</div>
              <p className="text-gray-600 mb-6">Tailored solutions for your specifc needs</p>

              <ul className="space-y-4 mb-8">
                {projectFeatures.map((feature, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">{feature.title}</p>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>

              <button 
                className="w-full border-2 border-black rounded-full py-4 font-medium flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors"
                onMouseEnter={() => setShowChatPreview(true)}
                onMouseLeave={() => setShowChatPreview(false)}
                onClick={() => window.open('https://cal.com/blueprint-studio/intro-call', '_blank')}
              >
                <span>Get Quote</span>
                <ArrowUpRight className="w-5 h-5 ml-2 text-gray-300 group-hover:text-white transition-colors" />
              </button>

              {/* Chat Preview */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: showChatPreview ? 1 : 0,
                  y: showChatPreview ? 0 : 10
                }}
                className="absolute top-[calc(100%-12px)] right-[28%] translate-x-1/2 bg-white p-6 rounded-xl shadow-xl w-48 pointer-events-none z-10"
              >
                <div className="relative">
                  <div className="absolute top-0.5 right-0.5 w-6 h-6 bg-black rounded-full flex items-center justify-center -mt-3 -mr-3 z-20">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                  <img 
                    src={previewImages.chat}
                    alt="Chat Interface"
                    className="w-full h-auto rounded-lg mb-2"
                  />
                  <p className="text-xs text-gray-600 text-center mt-4">Chat right now</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Updated FAQ section */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Frequently Asked Questions</h3>
            <p className="text-gray-600">Everything you need to know about our&nbsp;pricing&nbsp;and&nbsp;services</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
              {pricingFaqs.map((faq, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <FaqItem question={faq.question} answer={faq.answer} />
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-16">
            <p className="text-gray-600">
              Still have questions?{' '}
              <a 
                href="mailto:blueprint.dao@gmail.com" 
                className="text-black font-medium hover:underline"
              >
                Email us
              </a>
            </p>
          </div>
        </div>
        </div>
      </section>
    </>
  );
}
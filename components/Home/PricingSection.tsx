"use client";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "../ui/SectionHeader";
import { ArrowUpRight, Package, MessageCircle, CheckCircle, Palette, Rocket } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const GreenCheckIcon = () => (
  <svg className="shrink-0" width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M8 16.5C12.4183 16.5 16 12.9183 16 8.5C16 4.08172 12.4183 0.5 8 0.5C3.58172 0.5 0 4.08172 0 8.5C0 12.9183 3.58172 16.5 8 16.5ZM12.1402 6.76822C12.5645 6.41466 12.6218 5.78409 12.2682 5.35982C11.9147 4.93554 11.2841 4.87821 10.8598 5.23178C8.77424 6.96976 7.16738 9.14507 6.32238 10.4082L5.20711 9.29289C4.81658 8.90237 4.18342 8.90237 3.79289 9.29289C3.40237 9.68342 3.40237 10.3166 3.79289 10.7071L5.05227 11.9665L5.07158 11.9858C5.18281 12.0971 5.30509 12.2194 5.41781 12.3151C5.53751 12.4167 5.74124 12.5732 6.0259 12.6469C6.37714 12.7379 6.73665 12.7013 7.06241 12.5416C7.33043 12.4101 7.5004 12.2102 7.59559 12.0881C7.68769 11.9699 7.78489 11.8223 7.87507 11.6855L7.87509 11.6854L7.89023 11.6625L7.89083 11.6616C8.66198 10.4919 10.1883 8.3948 12.1402 6.76822Z" fill="#22D461"/>
  </svg>
);

export default function PricingSection() {
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

      <SectionHeader leftText="PRICING" rightText="// transparent" />

      {/* Main Content */}
      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="pt-8 sm:pt-12 lg:pt-16 pb-8 sm:pb-12 lg:pb-16 px-2.5 sm:px-6 relative">
          {/* Inner dashed vertical lines on desktop */}
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          
          {/* Heading and Description Row */}
          <div className="flex flex-col items-center text-center gap-4 mb-8 sm:mb-12">
            <h2 className="font-medium text-black cursor-default"
                style={{
                  fontSize: 'clamp(48px, 10vw, 88px)',
                  lineHeight: 'clamp(97%, 1vw, 100%)',
                  letterSpacing: '-2.04px'
                }}>
              Pricing
            </h2>
            <p className="font-normal text-neutral-500 max-w-xl cursor-default"
               style={{
                 fontSize: 'clamp(16px, 3vw, 20px)',
                 lineHeight: '140%',
                 letterSpacing: '-0.4px'
               }}>
              Join{' '}
              <strong
                className="font-semibold"
                style={{
                  background: 'linear-gradient(92deg, #60AEEE -1.22%, #2563EB 18.8%, #3B82F6 38.82%, #60AEEE 69.04%, #3B82F6 87.52%, #2563EB 98.88%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                25+ tech founders
              </strong>
              {' '}who shipped<br className="sm:hidden" /> with Blueprint Studio.
            </p>
          </div>

          {/* Three Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
            {/* Left Column - Three Cards */}
            <div className="flex flex-col justify-center items-start gap-1 p-1 rounded-[20px] border border-neutral-300 bg-neutral-200">
              {/* Card 1 - Subscribe */}
              <div className="flex flex-col justify-between items-start flex-1 self-stretch p-4 rounded-2xl border border-neutral-300 bg-neutral-100">
                <div className="flex justify-between items-center w-full mb-3">
                  <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center border border-neutral-300">
                    <CheckCircle className="w-4 h-4 text-neutral-600" />
                  </div>
                  <span className="text-sm font-medium text-neutral-400">[1]</span>
                </div>
                <div>
                  <h4 className="font-medium text-base mb-1 text-black cursor-default">Subscribe</h4>
                  <p className="text-neutral-500 text-xs cursor-default">Pick a plan that fits your goals</p>
                </div>
              </div>

              {/* Card 2 - Request */}
              <div className="flex flex-col justify-between items-start flex-1 self-stretch p-4 rounded-2xl border border-neutral-300 bg-neutral-100">
                <div className="flex justify-between items-center w-full mb-3">
                  <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center border border-neutral-300">
                    <MessageCircle className="w-4 h-4 text-neutral-600" />
                  </div>
                  <span className="text-sm font-medium text-neutral-400">[2]</span>
                </div>
                <div>
                  <h4 className="font-medium text-base mb-1 text-black cursor-default">Request</h4>
                  <p className="text-neutral-500 text-xs cursor-default">Submit tasks</p>
                </div>
              </div>

              {/* Card 3 - Receive results */}
              <div className="flex flex-col justify-between items-start flex-1 self-stretch p-4 rounded-2xl border border-neutral-300 bg-neutral-100">
                <div className="flex justify-between items-center w-full mb-3">
                  <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center border border-neutral-300">
                    <Package className="w-4 h-4 text-neutral-600" />
                  </div>
                  <span className="text-sm font-medium text-neutral-400">[3]</span>
                </div>
                <div>
                  <h4 className="font-medium text-base mb-1 text-black cursor-default">Receive results</h4>
                  <p className="text-neutral-500 text-xs cursor-default">Updates delivered every 48 hours</p>
                </div>
              </div>
            </div>

            {/* Middle Column - Design & Build Subscription */}
            <div className="flex flex-col items-start gap-6 p-5 rounded-[20px] border border-neutral-300 bg-white">
              {/* Icon */}
              <div className="flex items-center gap-2 p-2 rounded-xl border border-neutral-300 bg-neutral-100">
                <Package className="w-4 h-4 text-neutral-600" />
              </div>
              
              {/* Title & Description */}
              <div>
                <h3 className="font-medium text-lg text-black cursor-default">
                  Design & Build Subscription
                </h3>
                <p className="text-neutral-500 text-sm cursor-default mt-1">
                  Keep&nbsp;shipping.
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-black cursor-default">
                  $15k+
                </span>
                <span className="text-sm text-neutral-500 italic cursor-default">
                  per month
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <GreenCheckIcon />
                  <p className="font-medium text-black text-sm cursor-default">Dedicated expertise</p>
                </li>
                <li className="flex items-start gap-3">
                  <GreenCheckIcon />
                  <p className="font-medium text-black text-sm cursor-default">Unlimited requests</p>
                </li>
                <li className="flex items-start gap-3">
                  <GreenCheckIcon />
                  <p className="font-medium text-black text-sm cursor-default">Rapid delivery</p>
                </li>
                <li className="flex items-start gap-3">
                  <GreenCheckIcon />
                  <p className="font-medium text-black text-sm cursor-default">Pause or cancel anytime</p>
                </li>
              </ul>

              {/* Button */}
              <motion.button
                className="group relative w-full py-3 px-6 font-medium flex items-center justify-center text-white rounded-xl mt-auto text-sm overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #60AEEE 0%, #3B82F6 25%, #2563EB 50%, #1D4ED8 75%, #4F46E5 100%)',
                  boxShadow: `
                    0 1px 2px rgba(0, 0, 0, 0.1),
                    0 2px 8px rgba(96, 174, 238, 0.3),
                    0 0 0 1px rgba(255, 255, 255, 0.1) inset,
                    0 1px 0 rgba(255, 255, 255, 0.2) inset
                  `,
                }}
            whileTap={{ scale: 0.97 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                }}
                onClick={() => window.open('https://cal.com/blueprint-studio/intro-call', '_blank')}
              >
                {/* Shader-like animated gradient */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: `
                      radial-gradient(ellipse 50% 80% at 30% 50%, rgba(147, 197, 253, 0.4) 0%, transparent 50%),
                      radial-gradient(ellipse 40% 70% at 70% 50%, rgba(96, 174, 238, 0.35) 0%, transparent 50%)
                    `,
                    filter: 'blur(1px)',
                  }}
                  animate={{
                    backgroundPosition: [
                      '0% 0%, 100% 0%',
                      '100% 0%, 0% 0%',
                      '0% 0%, 100% 0%',
                    ],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Drifting highlight */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(ellipse 80% 100% at center, rgba(147, 197, 253, 0.3) 0%, transparent 60%)',
                    filter: 'blur(3px)',
                  }}
                  animate={{
                    x: ['-40%', '40%', '-40%'],
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Top highlight */}
                <div
                  className="absolute inset-x-0 top-0 h-[1px]"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 20%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.4) 80%, transparent 100%)',
                  }}
                />

                <span className="relative z-10" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}>Book a Call</span>
                <ArrowUpRight className="w-4 h-4 ml-2 relative z-10 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.button>
            </div>

            {/* Third Column - Launch Packages */}
            <div className="flex flex-col items-start gap-6 p-5 rounded-[20px] border border-neutral-300 bg-neutral-100">
              {/* Icon */}
              <div className="flex items-center gap-2 p-2 rounded-xl border border-neutral-300 bg-neutral-200">
                <Rocket className="w-4 h-4 text-neutral-600" />
              </div>

              <div>
                <h3 className="font-medium text-lg text-black cursor-default">Launch Packages</h3>
                <p className="text-neutral-500 text-sm cursor-default mt-1">Get to&nbsp;market.</p>
              </div>

              {/* Package Rows */}
              <div className="w-full space-y-2">
                <Link
                  href="/launch-video"
                  className="flex items-center justify-between p-3 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 transition-colors group"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-sm text-black">Launch Video</span>
                    <span className="text-xs text-neutral-500">1-2 weeks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-black">$5K – $15K</span>
                    <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
                  </div>
                </Link>

                <Link
                  href="/brand"
                  className="flex items-center justify-between p-3 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 transition-colors group"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-sm text-black">Brand Identity</span>
                    <span className="text-xs text-neutral-500">3-4 weeks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-black">$15K – $20K</span>
                    <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
                  </div>
                </Link>

                <Link
                  href="/launch"
                  className="flex items-center justify-between p-3 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 transition-colors group"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-sm text-black">Full Launch</span>
                    <span className="text-xs text-neutral-500">6-12 weeks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-black">$50K – $120K</span>
                    <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
                  </div>
                </Link>
              </div>

              {/* Button with holographic border */}
              <motion.div
                className="relative w-full rounded-xl p-[2px] overflow-hidden mt-auto"
                whileTap={{ scale: 0.97 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                }}
              >
                {/* Holographic border background */}
                <div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, #60AEEE 0%, #3B82F6 25%, #2563EB 50%, #1D4ED8 75%, #4F46E5 100%)',
                  }}
                />

                {/* Animated shader on border */}
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: `
                      radial-gradient(ellipse 50% 80% at 30% 50%, rgba(147, 197, 253, 0.5) 0%, transparent 50%),
                      radial-gradient(ellipse 40% 70% at 70% 50%, rgba(96, 174, 238, 0.4) 0%, transparent 50%)
                    `,
                    filter: 'blur(1px)',
                  }}
                  animate={{
                    backgroundPosition: [
                      '0% 0%, 100% 0%',
                      '100% 0%, 0% 0%',
                      '0% 0%, 100% 0%',
                    ],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Drifting highlight on border */}
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: 'radial-gradient(ellipse 80% 100% at center, rgba(147, 197, 253, 0.4) 0%, transparent 60%)',
                    filter: 'blur(2px)',
                  }}
                  animate={{
                    x: ['-40%', '40%', '-40%'],
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Inner button */}
                <Link
                  href="/launch"
                  className="relative w-full py-[10px] px-6 font-medium flex items-center justify-center text-neutral-700 rounded-[10px] text-sm"
                  style={{
                    background: 'rgba(255, 255, 255, 0.92)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <span>View Packages</span>
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Link>
              </motion.div>
            </div>
          </div>
        </InnerContainer>
      </OuterContainer>
      
      <div className="w-full line-dash-x"/>
    </Section>
  );
}
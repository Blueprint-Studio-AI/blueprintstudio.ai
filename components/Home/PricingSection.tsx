"use client";
import Section from "@/components/ui/Section";
import OuterContainer from "@/components/ui/OuterContainer";
import InnerContainer from "@/components/ui/InnerContainer";
import SectionHeader from "../ui/SectionHeader";
import { ArrowUpRight, Package, MessageCircle, CheckCircle, Palette, BarChart3 } from "lucide-react";

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

      <SectionHeader leftText="PRICING" rightText="synced ⋯ secure" />

      {/* Main Content */}
      <OuterContainer className="flex-1 flex items-center">
        <InnerContainer className="pt-8 sm:pt-12 lg:pt-16 pb-8 sm:pb-12 lg:pb-16 px-2.5 sm:px-6 relative">
          {/* Inner dashed vertical lines on desktop */}
          <div className="absolute left-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          <div className="absolute right-0 top-0 bottom-0 line-dash-y hidden custom:block" />
          
          {/* Heading and Description Row */}
          <div className="flex flex-col items-center text-center gap-4 mb-8 sm:mb-12">
            <h2 className="font-medium text-black"
                style={{
                  fontSize: 'clamp(41px, 8vw, 68px)', 
                  lineHeight: 'clamp(97%, 1vw, 100%)',
                  letterSpacing: '-2.04px' 
                }}>
              Pricing
            </h2>
            <p className="font-normal text-neutral-500 max-w-lg" 
               style={{ 
                 fontSize: 'clamp(18px, 3.5vw, 24px)', 
                 lineHeight: '110%', 
                 letterSpacing: '-0.96px' 
               }}>
              Become a studio partner
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
                  <span className="text-sm font-medium text-neutral-700">[1]</span>
                </div>
                <div>
                  <h4 className="font-medium text-base mb-1 text-black">Subscribe</h4>
                  <p className="text-neutral-500 text-xs">Pick a plan that fits your goals</p>
                </div>
              </div>

              {/* Card 2 - Request */}
              <div className="flex flex-col justify-between items-start flex-1 self-stretch p-4 rounded-2xl border border-neutral-300 bg-neutral-100">
                <div className="flex justify-between items-center w-full mb-3">
                  <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center border border-neutral-300">
                    <MessageCircle className="w-4 h-4 text-neutral-600" />
                  </div>
                  <span className="text-sm font-medium text-neutral-700">[2]</span>
                </div>
                <div>
                  <h4 className="font-medium text-base mb-1 text-black">Request</h4>
                  <p className="text-neutral-500 text-xs">Submit tasks via your company portal</p>
                </div>
              </div>

              {/* Card 3 - Receive results */}
              <div className="flex flex-col justify-between items-start flex-1 self-stretch p-4 rounded-2xl border border-neutral-300 bg-neutral-100">
                <div className="flex justify-between items-center w-full mb-3">
                  <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center border border-neutral-300">
                    <Package className="w-4 h-4 text-neutral-600" />
                  </div>
                  <span className="text-sm font-medium text-neutral-700">[3]</span>
                </div>
                <div>
                  <h4 className="font-medium text-base mb-1 text-black">Receive results</h4>
                  <p className="text-neutral-500 text-xs">Pick a plan that fits your workflow</p>
                </div>
              </div>
            </div>

            {/* Middle Column - Design & Build Subscription */}
            <div className="flex flex-col items-start gap-6 p-5 rounded-[20px] border border-neutral-300 bg-white">
              {/* Icon */}
              <div className="flex items-center gap-2 p-2 rounded-xl border border-neutral-300 bg-neutral-100">
                <Package className="w-4 h-4 text-neutral-600" />
              </div>
              
              {/* Title */}
              <h3 className="font-medium text-lg text-black">
                Design & Build Subscription
              </h3>
              
              {/* Price */}
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-black">
                  $10k+
                </span>
                <span className="text-sm text-neutral-500 italic">
                  per month
                </span>
              </div>

              {/* Description */}
              <p className="text-neutral-500 text-sm">
                All inclusive service with dedicated team attached to you.
              </p>

              {/* Features */}
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <ArrowUpRight className="w-4 h-4 text-neutral-400 shrink-0 mt-1" />
                  <p className="font-medium text-black text-sm">Dedicated team</p>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowUpRight className="w-4 h-4 text-neutral-400 shrink-0 mt-1" />
                  <p className="font-medium text-black text-sm">Unlimited requests</p>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowUpRight className="w-4 h-4 text-neutral-400 shrink-0 mt-1" />
                  <p className="font-medium text-black text-sm">Priority support</p>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowUpRight className="w-4 h-4 text-neutral-400 shrink-0 mt-1" />
                  <p className="font-medium text-black text-sm">Rapid delivery</p>
                </li>
              </ul>

              {/* Button */}
              <button 
                className="w-full py-3 px-6 font-medium flex items-center justify-center bg-white text-black border border-neutral-300 rounded-lg hover:bg-black hover:text-white hover:border-black transition-all duration-200 mt-auto text-sm group"
                onClick={() => window.open('https://cal.com/blueprint-studio/intro-call', '_blank')}
              >
                <span>Book a Call</span>
                <ArrowUpRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>

            {/* Third Column - Project Based */}
            <div className="flex flex-col items-start gap-6 p-5 rounded-[20px] border border-neutral-300 bg-neutral-100">
              {/* Icon */}
              <div className="flex items-center gap-2 p-2 rounded-xl border border-neutral-300 bg-neutral-200">
                <BarChart3 className="w-4 h-4 text-neutral-600" />
              </div>
              
              <h3 className="font-medium text-lg text-black">Project-Based</h3>
              <div className="text-2xl font-bold text-black">Get Instant Quote</div>
              <p className="text-neutral-500 text-sm">Tailored solutions for your specific needs</p>

              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <ArrowUpRight className="w-4 h-4 text-neutral-400 shrink-0 mt-1" />
                  <p className="font-medium text-black text-sm">Custom scope & timeline</p>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowUpRight className="w-4 h-4 text-neutral-400 shrink-0 mt-1" />
                  <p className="font-medium text-black text-sm">Fixed pricing</p>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowUpRight className="w-4 h-4 text-neutral-400 shrink-0 mt-1" />
                  <p className="font-medium text-black text-sm">Project management</p>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowUpRight className="w-4 h-4 text-neutral-400 shrink-0 mt-1" />
                  <p className="font-medium text-black text-sm">Flexible options</p>
                </li>
              </ul>

              <button 
                className="w-full py-3 px-6 font-medium flex items-center justify-center bg-neutral-200 text-black border border-neutral-300 rounded-lg hover:bg-black hover:text-white hover:border-black transition-all duration-200 text-sm group"
                onClick={() => window.open('https://cal.com/blueprint-studio/intro-call', '_blank')}
              >
                <span>Get Quote</span>
                <ArrowUpRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </InnerContainer>
      </OuterContainer>
      
      <div className="w-full line-dash-x"/>
    </Section>
  );
}
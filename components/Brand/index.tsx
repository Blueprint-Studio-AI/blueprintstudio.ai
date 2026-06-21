"use client";

import { MotionConfig } from "framer-motion";
import { Footer } from "@/components/Footer/index";
import { PackageProvider } from "./PackageContext";
import HeroSection from "./HeroSection";
import DepthSection from "./DepthSection";
import RecentWorkSection from "./RecentWorkSection";
import ProcessSection from "./ProcessSection";
import TestimonialTicker from "@/components/LaunchVideos/TestimonialTicker";
import WhatsIncludedSection from "./WhatsIncludedSection";
import PricingSection from "./PricingSection";
import FoundersSection from "./FoundersSection";
import CTASection from "./CTASection";
import FAQSection from "./FAQSection";

export default function BrandPage() {
  return (
    <PackageProvider>
    {/* reducedMotion="user" makes every framer-motion animation on the page
        honor the OS "reduce motion" setting (WCAG 2.3.3). */}
    <MotionConfig reducedMotion="user">
    {/* Helvetica Neue is scoped to the brand page via font-sans; the rest of the site stays on Inter (set globally in app/layout.tsx). */}
    <div className="font-sans">
      <HeroSection />
      <DepthSection />
      <ProcessSection />
      <RecentWorkSection />
      <WhatsIncludedSection />
      <PricingSection />
      <FoundersSection />
      <TestimonialTicker />
      <CTASection />
      <FAQSection />
      <Footer />
    </div>
    </MotionConfig>
    </PackageProvider>
  );
}

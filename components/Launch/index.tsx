"use client";

import { Footer } from "@/components/Footer/index";
import HeroSection from "./HeroSection";
import ProblemSection from "./ProblemSection";
import PackageSection from "./PackageSection";
import RecentWorkSection from "./RecentWorkSection";
import ProcessSection from "./ProcessSection";
import TestimonialTicker from "@/components/LaunchVideos/TestimonialTicker";
import PricingSection from "./PricingSection";
import FoundersSection from "./FoundersSection";
import CTASection from "./CTASection";
import FAQSection from "./FAQSection";

export default function LaunchPage() {
  return (
    <div>
      <HeroSection />
      <ProblemSection />
      <PackageSection />
      <RecentWorkSection />
      <ProcessSection />
      <TestimonialTicker />
      <PricingSection />
      <FoundersSection />
      <CTASection />
      <FAQSection />
      <Footer />
    </div>
  );
}

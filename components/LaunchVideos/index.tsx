"use client";

import { Footer } from "@/components/Footer/index";
import HeroSection from "./HeroSection";
import RecentWorkSection from "./RecentWorkSection";
import ProcessSection from "./ProcessSection";
import TestimonialTicker from "./TestimonialTicker";
import PricingSection from "./PricingSection";
import FoundersSection from "./FoundersSection";
import FAQSection from "./FAQSection";
import CTASection from "./CTASection";

export default function LaunchVideosPage() {
  return (
    <div>
      <HeroSection />
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

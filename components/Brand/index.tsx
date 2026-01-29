"use client";

import { Footer } from "@/components/Footer/index";
import HeroSection from "./HeroSection";
import RecentWorkSection from "./RecentWorkSection";
import ProcessSection from "./ProcessSection";
import DeliverablesSection from "./DeliverablesSection";
import TestimonialTicker from "@/components/LaunchVideos/TestimonialTicker";
import PricingSection from "./PricingSection";
import FoundersSection from "./FoundersSection";
import CTASection from "./CTASection";
import FAQSection from "./FAQSection";

export default function BrandPage() {
  return (
    <div>
      <HeroSection />
      <RecentWorkSection />
      <ProcessSection />
      <DeliverablesSection />
      <TestimonialTicker />
      <PricingSection />
      <FoundersSection />
      <CTASection />
      <FAQSection />
      <Footer />
    </div>
  );
}

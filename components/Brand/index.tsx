"use client";

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
    <div>
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
    </PackageProvider>
  );
}

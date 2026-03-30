"use client";

import { Footer } from "@/components/Footer/index";
import { BrandPackageProvider } from "./BrandPackageContext";
import HeroSection from "./HeroSection";
import ManifestoSection from "./ManifestoSection";
import PortfolioSection from "./PortfolioSection";
import ProcessSection from "./ProcessSection";
import PackageSection from "./PackageSection";
import StatsBarSection from "./StatsBarSection";
import TestimonialTicker from "@/components/LaunchVideos/TestimonialTicker";
import PricingSection from "./PricingSection";
import FoundersSection from "./FoundersSection";
import CTASection from "./CTASection";
import FAQSection from "./FAQSection";

export default function BrandPage() {
  return (
    <BrandPackageProvider>
      <div>
        <HeroSection />
        <ManifestoSection />
        <PortfolioSection />
        <ProcessSection />
        <PackageSection />
        <StatsBarSection />
        <TestimonialTicker />
        <PricingSection />
        <FoundersSection />
        <CTASection />
        <FAQSection />
        <Footer />
      </div>
    </BrandPackageProvider>
  );
}

// app/services/page.tsx
"use client";

import React from 'react';
import { Hero } from '@/components/services-index/Hero';
import { Services } from '@/components/services-index/Services';
import { HowWeWork } from '@/components/services-index/HowWeWork';
import { WhyUs } from '@/components/services-index/WhyUs';
import { Footer } from '@/components/Footer';
import { PricingSection } from '@/components/PricingSection';

const ServicesLayout: React.FC = () => {
  return (
    <main className="min-h-screen bg-background text-foreground services-theme relative">
      {/* Background patterns that span the entire layout */}
      <div className="fixed inset-0 bg-dot-pattern opacity-5 pointer-events-none" />
      
      {/* Content */}
      <div className="relative">
        <div className="max-w-4xl mx-auto overflow-visible">
          <Hero />
          <div id="services">
            <Services />
          </div>
          <HowWeWork />
        </div>
        <WhyUs />
        <PricingSection/> 
        <Footer />
      </div>
    </main>
  );
}

export default ServicesLayout;
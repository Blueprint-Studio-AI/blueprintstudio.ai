// service-pages/components/templates/ServicesLayout.tsx
import { Hero } from '@/service-pages/components/sections/services-page-sections/Hero';
import { Services } from '../sections/services-page-sections/Services';
import { HowWeWork } from '../sections/services-page-sections/HowWeWork';
import { WhyUs } from '../sections/services-page-sections/WhyUs';
import { CTA } from '../sections/services-page-sections/CTA';
import { Footer } from '@/service-components/sections/Footer';
import { PricingCalculator } from '@/components/PricingCalculator';

// service-pages/components/templates/ServicesLayout.tsx
export function ServicesLayout() {
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
        <PricingCalculator/>
        <Footer />
      </div>
    </main>
  );
}
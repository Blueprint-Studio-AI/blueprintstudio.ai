// service-pages/components/templates/ServicesLayout.tsx
import { HeroTwo } from '@/service-pages/components/sections/services-page-sections/HeroTwo';
import { Services } from '../sections/services-page-sections/Services';
import { HowWeWork } from '../sections/services-page-sections/HowWeWork';
import { WhyUs } from '../sections/services-page-sections/WhyUs';
import { CTA } from '../sections/services-page-sections/CTA';
import { Footer } from '@/service-components/sections/Footer';

export function ServicesLayout() {
  return (
    <main className="min-h-screen bg-background text-foreground services-theme">
      <HeroTwo />
      <Services />
      <HowWeWork />
      <WhyUs />
      <CTA />
      <Footer />
    </main>
  );
}
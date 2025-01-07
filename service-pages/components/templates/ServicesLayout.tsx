import { Hero } from '@/service-pages/components/sections/Hero';
import { HeroTwo } from '@/service-pages/components/sections/HeroTwo';
import { Services } from '@/service-pages/components/sections/Services';
import { HowWeWork } from '@/service-pages/components/sections/HowWeWork';
import { WhyUs } from '@/service-pages/components/sections/WhyUs';
import { CTA } from '@/service-pages/components/sections/CTA';
import { Footer } from '@/service-pages/components/sections/Footer';

export function ServicesLayout() {
  return (
    <main className="min-h-screen bg-background text-foreground services-theme">
      {/* <Hero /> */}
      
      <HeroTwo />
      <Services />
      <HowWeWork />
      <WhyUs />
      <CTA />
      <Footer />
    </main>
  );
}
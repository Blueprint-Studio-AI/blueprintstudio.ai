import { Hero } from '@/service-pages/components/sections/Hero';
import { Services } from '@/service-pages/components/sections/Services';
import { SocialProof } from '@/service-pages/components/sections/SocialProof';
import { CTA } from '@/service-pages/components/sections/CTA';
import { Footer } from '@/service-pages/components/sections/Footer';

export function ServicesLayout() {
  return (
    <main className="min-h-screen bg-background text-foreground services-theme">
      <Hero />
      <Services />
      <SocialProof />
      <CTA />
      <Footer />
    </main>
  );
}
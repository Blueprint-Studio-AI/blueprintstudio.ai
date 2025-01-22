// service-pages/components/sections/service-page-sections/Hero.tsx
import { motion } from 'framer-motion';
import { ServiceCategoryTag } from '../../ui/ServiceCategoryTag';
import { Button } from '../../ui/button';

interface HeroProps {
  headline: string;
  valueProposition: string;
  ctaText: string;
  ctaUrl: string;
  categoryTag: string;
}

export function Hero({
  headline,
  valueProposition,
  ctaText,
  ctaUrl,
  categoryTag
}: HeroProps) {
  return (
    <section className="relative min-h-[70vh] flex flex-col justify-center">
      {/* Background Patterns - matching services page */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square rounded-full"
          style={{
            background: "radial-gradient(circle at center, rgba(var(--primary-rgb), 0.03) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="container relative px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <ServiceCategoryTag>{categoryTag}</ServiceCategoryTag>
          
          <h1 
            className="mt-6 font-serif font-medium leading-[0.85] tracking-tight"
            style={{ 
              fontSize: 'clamp(3rem, 10vw, 6rem)',
              letterSpacing: '0.02em'
            }}
          >
            {headline}
          </h1>
          
          <p className="mt-8 text-xl md:text-2xl text-muted-foreground">
            {valueProposition}
          </p>

          <Button 
            size="lg"
            className="mt-12 text-lg px-8 py-6 rounded-full bg-primary hover:bg-primary/90"
            onClick={() => window.location.href = ctaUrl}
          >
            {ctaText}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
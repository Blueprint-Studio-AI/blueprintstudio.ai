// service-pages/components/sections/services-page-sections/Hero.tsx
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container px-4 py-32 relative">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Service tag */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-sm font-medium">Full-Service Strategic Partner</span>
            </div>

            {/* Main content */}
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Transform Your Digital <br />
              <span className="text-gradient">Business Ecosystem</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl">
              From strategy to execution, we help ambitious brands create 
              exceptional digital experiences that drive real business outcomes.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg"
                className="group"
                onClick={() => window.open('https://cal.com/blueprint/intro', '_blank')}
              >
                Schedule Consultation
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  document.getElementById('services')?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  });
                }}
              >
                Explore Services
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
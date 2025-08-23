// components/service-page/service-design/ServiceDesignHero.tsx
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ServiceDesignHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center">
      <div className="container px-4 py-32 relative">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* SEO-optimized heading structure */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-sm font-medium">Service Design Services</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Service Design That
              <span className="text-gradient block">Delivers Results</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl">
              Transform your customer journey with strategic service design solutions 
              that enhance experiences, streamline operations, and drive business growth.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg"
                className="group"
                onClick={() => window.open('https://cal.com/blueprint-studio/intro-call', '_blank')}
              >
                Get Started
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
              
              {/* <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  document.getElementById('solutions')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
              >
                View Solutions
              </Button> */}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
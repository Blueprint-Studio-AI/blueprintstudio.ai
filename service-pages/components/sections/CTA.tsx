import { motion } from 'framer-motion';
import { Rocket, Sparkles, ArrowUpRight } from 'lucide-react';
import { Button } from "@/service-pages/components/ui/button";
import { SectionTitle } from '../ui/section-title';

export function CTA() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="absolute inset-0 bg-dot-pattern opacity-5" />
      </div>
      
      <div className="container relative px-4">
        
        <SectionTitle
          title="Start Now"
          description="We don't waste time on scope negotiation. We crush bottlenecks with urgency and accelerate your success."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative bg-background/50 backdrop-blur-xl border border-primary/10 rounded-2xl p-12 md:p-16 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-primary/10 to-transparent opacity-50 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-primary/10 to-transparent opacity-50 blur-3xl" />
            
            <div className="relative">
              <div className="flex items-center justify-center gap-3 mb-8">
                <Rocket className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium bg-primary/10 px-3 py-1 rounded-full">Design & Build Subscription</span>
                <Sparkles className="w-6 h-6 text-primary" />
              </div>

              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-6xl font-bold mb-6">
                  Design & Build
                  <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
                    Without Limits
                  </span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Unlimited design, development, and deployment.
                  One flat monthly rate. Continuous innovation.
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="mb-8 text-center">
                  <div className="text-sm text-muted-foreground mb-2">Starting at</div>
                  <div className="text-5xl font-bold">$10,000</div>
                  <div className="text-sm text-muted-foreground mt-2">per month</div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="h-14 px-8 text-lg group">
                    Start Creating Today
                    <ArrowUpRight className="ml-2 w-5 h-5 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
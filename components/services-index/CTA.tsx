import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { SectionTitle } from '../ui/section-title';

const subscriptionFeatures = [
  "Full access to all service categories",
  "Create & Launch: Digital products, MVPs, websites",
  "Grow & Scale: Brand, marketing, content",
  "Elevate & Perfect: UX/UI, CX optimization",
  "Enable & Advance: Team augmentation, training",
  "Innovate & Lead: AI, emerging tech, strategy",
  "Progress updates every Tuesday & Thursday",
  "Pause or cancel anytime"
];

const customFeatures = [
  "Choose from any service category",
  "Focused project scope",
  "Dedicated project team",
  "Custom timeline and deliverables",
  "Comprehensive documentation",
  "Future-ready solutions"
];

export function CTA() {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7 }}
      className="py-32 relative"
    >
      <div className="absolute inset-0 bg-dot-pattern opacity-5" />
      
      <div className="container relative px-4">
        <SectionTitle
          title="Pricing"
          description="Choose between focused project execution or comprehensive ongoing partnership - both backed by our full-spectrum expertise."
          align='center'
        />

        <div className="grid md:grid-cols-2 gap-8 mt-16 max-w-5xl mx-auto">
          {/* Custom Quote Card */}
          <div className="relative bg-background/50 backdrop-blur-sm border border-foreground/10 rounded-2xl p-8 hover:border-primary/20 transition-all duration-300">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Project-Based</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Custom Quote</h3>
              <p className="text-muted-foreground">
                Perfect for focused initiatives - from digital products to AI integration, choose exactly what you need.
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {customFeatures.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <Button 
              variant="outline" 
              className="w-full group"
              onClick={() => window.open('https://cal.com/adriastudio/custom', '_blank')}
            >
              Share Your Vision
              <ArrowUpRight className="ml-2 w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Button>
          </div>

          {/* Subscription Card */}
          <div className="relative bg-primary/5 backdrop-blur-sm border border-primary/20 rounded-2xl p-8 hover:border-primary/40 transition-all duration-300">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium bg-primary/10 px-3 py-1 rounded-full">
                  All-Access
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Design & Build Subscription</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">$10,000</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-muted-foreground">
                Unlimited access to our full spectrum of services - from creation to innovation, all in one subscription.
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {subscriptionFeatures.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <Button 
              className="w-full group"
              onClick={() => window.open('https://cal.com/adriastudio/unlimited', '_blank')}
            >
              Let&apos;s Work Together
              <ArrowUpRight className="ml-2 w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
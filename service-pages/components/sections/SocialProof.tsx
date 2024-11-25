import { motion } from 'framer-motion';
import { Palette, Brain, Blocks, Clock, ArrowUpRight, ArrowRight } from 'lucide-react';
import { Button } from '@/service-pages/components/ui/button';

const coreStrengths = [
  { 
    icon: Palette,
    title: "Design DNA",
    description: "Experience-obsessed, from backend to brand"
  },
  { 
    icon: Brain,
    title: "AI-Native",
    description: "Hybrid intelligence, 10x team efficiency"
  },
  { 
    icon: Blocks,
    title: "Full-Service",
    description: "Integrated excellence, all in-house"
  },
  { 
    icon: Clock,
    title: "Always Available",
    description: "blueprint sleep comes after your success"
  }
];

const metrics = [
  { value: "450+", label: "Pages Migrated" },
  { value: "3x", label: "Performance Boost" },
  { value: "65%", label: "Conversion Increase" },
  { value: "2.5s", label: "Load Time Reduction" }
];

export function SocialProof() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-5" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      
      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-16"
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "3rem" }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="h-1 bg-primary mb-6"
          />
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
            Why blueprint
          </h2>
          <p className="text-xl text-muted-foreground">
            We combine creativity, technology, and strategy to deliver exceptional results.
          </p>
        </motion.div>

        {/* Core Strengths */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-32">
          {coreStrengths.map((strength, index) => {
            const Icon = strength.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <motion.div
                  className="absolute -inset-4 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={false}
                  whileHover={{ scale: 1.02 }}
                />
                <div className="relative">
                  <div className="p-3 rounded-lg bg-primary/5 w-fit mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{strength.title}</h3>
                  <p className="text-sm text-muted-foreground">{strength.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Featured Case Study */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent opacity-50 blur-3xl" />
          
          <div className="relative bg-background/50 backdrop-blur-xl border border-primary/10 rounded-2xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left Column - Image */}
              <div className="relative aspect-[4/3] lg:aspect-auto">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
                  alt="TokenWorks Case Study"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent lg:hidden" />
                <div className="absolute inset-0 p-8 flex flex-col justify-end lg:hidden">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">TokenWorks</h3>
                  <p className="text-muted-foreground">eCommerce Transformation</p>
                </div>
              </div>

              {/* Right Column - Content */}
              <div className="p-8 lg:py-16 lg:pr-16 flex flex-col justify-center">
                <div className="hidden lg:block mb-8">
                  <h3 className="text-3xl font-bold mb-2">TokenWorks</h3>
                  <p className="text-muted-foreground">eCommerce Transformation</p>
                </div>

                <p className="text-lg text-muted-foreground mb-8">
                  Complete digital transformation from WordPress to a modern, headless Next.js architecture while maintaining WooCommerce functionality. Full-service redesign including branding, photography, and videography.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                  {metrics.map((metric, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="text-center"
                    >
                      <div className="text-3xl font-bold text-primary mb-2">{metric.value}</div>
                      <div className="text-sm text-muted-foreground">{metric.label}</div>
                    </motion.div>
                  ))}
                </div>

                <Button
                  size="lg"
                  className="w-full sm:w-auto group"
                >
                  View Case Study
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
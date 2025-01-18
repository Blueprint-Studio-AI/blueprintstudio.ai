import { motion } from 'framer-motion';
import { ArrowRight, Activity, Brain, Target, Clock, Palette, Compass, Microscope } from 'lucide-react';
import { SectionTitle } from '../ui/section-title';

const allStrengths = [
    {
      icon: Compass,
      title: "Strategic Partner",
      description: "We're not here to sell you a specific service - we're here to grow your business. Our success is measured by your outcomes."
    },
    {
      icon: Target,
      title: "Holistic Approach",
      description: "We examine your entire business ecosystem, not just isolated touchpoints or channels."
    },
    {
      icon: Microscope,
      title: "Scientific Mindset",
      description: "Every iteration is hypothesis-driven, tested, and refined based on real-world data."
    },
    { 
      icon: Palette,
      title: "Design DNA",
      description: "Experience-obsessed, from backend to brand."
    },
    { 
      icon: Brain,
      title: "AI-Native",
      description: "Hybrid intelligence, 10x team efficiency."
    },
    { 
      icon: Clock,
      title: "Always Available",
      description: "Blueprint sleeps after your success."
    }
  ];

export function WhyUs() {
    return (
        <>
        {/* Why Blueprint */}
            <section className="container px-4 mb-32">
            <SectionTitle
                title="Why Blueprint"
                description="We're not just another agency. We're a strategic partner focused on delivering measurable business outcomes."
                align='center'
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 mb-32">
                {allStrengths.map((strength, index) => (
                <motion.div
                    key={strength.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative p-8 rounded-2xl border border-foreground/10 bg-background/50 backdrop-blur-sm hover:border-primary/20 transition-colors duration-300"
                >
                    <div className="flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-2 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors duration-300">
                        <strength.icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold">{strength.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                        {strength.description}
                    </p>
                    </div>
                    
                    {/* Subtle gradient overlay on hover */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </motion.div>
                ))}
            </div>
            </section>
    </>
);
}
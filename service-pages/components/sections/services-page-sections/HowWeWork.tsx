import { motion } from 'framer-motion';
import { Brain, Target, GitBranch, Box } from 'lucide-react';
import { SectionTitle } from '../../ui/section-title';

const processSteps = [
  {
    title: "Discover & Define",
    description: "We break everything down to first principles, challenging assumptions and mental models. Through deep research and ecosystem mapping, we uncover the core opportunities that others miss.",
    icon: Brain,
    color: "text-blue-500"
  },
  {
    title: "Design & Plan",
    description: "Building from validated fundamentals, we design comprehensive solutions that address root causes rather than symptoms. Every decision is intentional, every feature earned.",
    icon: GitBranch,
    color: "text-purple-500"
  },
  {
    title: "Build & Refine",
    description: "We execute with precision, using agile methodologies to deliver value early and often, continuously testing our assumptions against real-world feedback.",
    icon: Box,
    color: "text-rose-500"
  },
  {
    title: "Launch & Scale",
    description: "Post-launch, we measure impact against core business metrics, optimizing performance and iterating to ensure sustainable growth and ROI.",
    icon: Target,
    color: "text-green-500"
  }
];

export function HowWeWork() {
  return (
    <section className="py-24 relative">
      
      <div className="container px-4">
        <SectionTitle
          title="How We Work"
          description="A proven process that consistently delivers exceptional results."
          align="center"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {processSteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative p-8 rounded-2xl border border-foreground/10 bg-background/50 backdrop-blur-sm hover:border-primary/20 transition-all duration-300 group"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors duration-300">
                    <step.icon className={`w-6 h-6 text-primary`} />
                  </div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
              
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
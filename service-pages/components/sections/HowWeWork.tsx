import { motion } from 'framer-motion';
import { ArrowRight, Activity, Brain, Target, Clock, Palette, Compass, Microscope } from 'lucide-react';
import { SectionTitle } from '../ui/section-title';

const processSteps = [
  {
    title: "Service Design First",
    description: "We map your entire business ecosystem, identifying opportunities and friction points through deep research and service blueprinting.",
    icon: Brain,
    color: "text-blue-500"
  },
  {
    title: "Data-Driven Strategy",
    description: "Advanced analytics and user research inform every decision, ensuring we focus on high-impact opportunities.",
    icon: Activity,
    color: "text-purple-500"
  },
  {
    title: "ROI-Focused Execution",
    description: "We prioritize initiatives that deliver measurable business outcomes, treating your investment as if it were our own.",
    icon: Target,
    color: "text-rose-500"
  }
];

export function HowWeWork() {
  return (
    <div className="py-24 bg-background">
      {/* How We Work */}
      <section className="container px-4 mb-32">
        <SectionTitle
          title="How We Work"
          description="We begin every project with service design, mapping the landscape to ensure that our solutions that meet real business goals."
          align="center"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {processSteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative p-8 rounded-2xl border border-foreground/10 bg-background/50 backdrop-blur-sm"
            >
              <step.icon className={`w-12 h-12 ${step.color} mb-6`} />
              <h3 className="text-xl font-bold mb-4">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>


      {/* Success Stories */}
      {/* <section className="container px-4">
        <SectionTitle
          title="Success Stories"
          description="Our approach consistently delivers exceptional results for our clients."
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {successMetrics.map((metric, index) => (
            <motion.div
              key={metric.metric}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="text-center p-8 rounded-2xl border border-foreground/10 bg-background/50 backdrop-blur-sm"
            >
              <div className="text-4xl font-bold text-primary mb-4">{metric.metric}</div>
              <p className="text-muted-foreground">{metric.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <a 
            href="/case-studies" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            View Case Studies
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </section> */}
    </div>
  );
}
// components/service-page/service-design/Process.tsx
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Search, Users, Map, Lightbulb, Workflow, LineChart, ExternalLink } from 'lucide-react';

const steps = [
  {
    icon: Search,
    name: "Research",
    title: "Understanding Context & Needs",
    description: "We begin by deeply understanding your business context, customer needs, and service challenges.",
    details: [
      "Stakeholder interviews",
      "Customer research",
      "Competitive analysis",
      "Service audit"
    ]
  },
  {
    icon: Users,
    name: "Empathize",
    title: "Building User Empathy",
    description: "We develop a deep understanding of your users through research and persona development.",
    details: [
      "User interviews",
      "Persona development",
      "Empathy mapping",
      "Need identification"
    ]
  },
  {
    icon: Map,
    name: "Map",
    title: "Visualizing the Journey",
    description: "We map the current service experience to identify pain points and opportunities.",
    details: [
      "Customer journey mapping",
      "Service blueprinting",
      "Touchpoint analysis",
      "Pain point identification"
    ]
  },
  {
    icon: Lightbulb,
    name: "Ideate",
    title: "Generating Solutions",
    description: "We collaboratively develop innovative solutions to transform the service experience.",
    details: [
      "Co-creation workshops",
      "Service concept development",
      "Opportunity prioritization",
      "Solution sketching"
    ]
  },
  {
    icon: Workflow,
    name: "Prototype",
    title: "Testing Concepts",
    description: "We create tangible prototypes of the service experience to test and refine.",
    details: [
      "Service prototyping",
      "Experience simulation",
      "User testing",
      "Concept refinement"
    ]
  },
  {
    icon: LineChart,
    name: "Implement",
    title: "Bringing Services to Life",
    description: "We develop implementation plans and support the rollout of your new service experience.",
    details: [
      "Implementation roadmap",
      "Staff training",
      "Service metrics",
      "Continuous improvement"
    ]
  }
];

export function Process() {
  return (
    <section className="py-24">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Our Service Design Process
            </h2>
            <p className="text-muted-foreground">
              A human-centered approach that transforms customer experiences
            </p>
          </div>

          <div className="grid gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Connector Line */}
                {index !== steps.length - 1 && (
                  <div className="absolute left-[39px] top-[80px] w-[2px] h-[calc(100%+48px)] bg-gradient-to-b from-primary/20 to-transparent" />
                )}

                <div className="flex gap-8">
                  {/* Step Number & Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-primary/5 flex items-center justify-center relative">
                      <step.icon className="w-8 h-8 text-primary" />
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center">
                        {index + 1}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-2">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      {step.details.map((detail) => (
                        <div
                          key={detail}
                          className="px-4 py-3 rounded-xl bg-primary/5 text-sm"
                        >
                          {detail}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>


          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <p className="text-muted-foreground mb-4">
              Ready to start your service design project?
            </p>
            
            <button
              onClick={() => window.open('https://cal.com/blueprint-studio/intro-call', '_blank')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Get a Free Consultation
            </button>
            
          </motion.div>
        </div>
      </div>
    </section>
  );
}
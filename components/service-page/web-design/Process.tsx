// components/service-page/web-design/Process.tsx
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Lightbulb, Telescope, Palette, Code2, LineChart, Sparkles, Link, ExternalLink } from 'lucide-react';

const steps = [
  {
    icon: Lightbulb,
    name: "Discovery",
    title: "Understanding Your Vision",
    description: "We start by deeply understanding your business goals, target audience, and unique requirements to lay the foundation for success.",
    details: [
      "Business goals analysis",
      "User research & personas",
      "Content strategy planning",
      "Technical requirements"
    ]
  },
  {
    icon: Telescope,
    name: "Strategy",
    title: "Research & Strategy",
    description: "We develop a comprehensive strategy that aligns design decisions with your business objectives and user needs.",
    details: [
      "Information architecture",
      "User flow mapping",
      "SEO strategy",
      "Technology selection"
    ]
  },
  {
    icon: Palette,
    name: "Design",
    title: "Crafting the Experience",
    description: "Our designers create an intuitive, engaging interface that reflects your brand and delights your users.",
    details: [
      "Wireframing & prototyping",
      "Visual design",
      "Responsive layouts",
      "Interactive elements"
    ]
  },
  {
    icon: Code2,
    name: "Development",
    title: "Building with Precision",
    description: "We bring the design to life with clean, efficient code that ensures your site performs flawlessly.",
    details: [
      "Frontend development",
      "CMS integration",
      "Performance optimization",
      "Security implementation"
    ]
  },
  {
    icon: LineChart,
    name: "Testing",
    title: "Ensuring Excellence",
    description: "Rigorous testing across devices and platforms ensures a seamless experience for all users.",
    details: [
      "Cross-browser testing",
      "Mobile optimization",
      "Performance testing",
      "User acceptance testing"
    ]
  },
  {
    icon: Sparkles,
    name: "Launch",
    title: "Going Live",
    description: "We carefully deploy your site and provide the support you need for a successful launch.",
    details: [
      "Deployment",
      "Analytics setup",
      "Documentation",
      "Post-launch support"
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
              Our Web Design Process
            </h2>
            <p className="text-muted-foreground">
              A proven approach that consistently delivers exceptional results
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
              Ready to start your web design project?
            </p>
            
            <button
              onClick={() => window.open('https://cal.com/blueprint-studio/intro-call', '_blank')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Get a Free Quote
            </button>
            
          </motion.div>
        </div>
      </div>
    </section>
  );
}
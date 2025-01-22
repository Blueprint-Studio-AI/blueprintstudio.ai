// service-pages/components/sections/service-page-sections/ServiceOverview.tsx
import { motion } from 'framer-motion';

interface ServiceOverviewProps {
  description: string;
  capabilities: Array<{
    title: string;
    description: string;
  }>;
  techStack: Array<{
    category: string;
    technologies: string[];
  }>;
  standards: string[];
}

export function ServiceOverview({
    description,
    capabilities,
    techStack,
    standards
  }: ServiceOverviewProps) {
    return (
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-dot-pattern opacity-5" />
        
        <div className="container px-4">
          {/* Service Description */}
          {description && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl"
            >
              <p className="text-xl text-muted-foreground">
                {description}
              </p>
            </motion.div>
          )}
  
          {/* Core Capabilities */}
          {capabilities?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16"
            >
              <h2 className="text-2xl font-bold mb-8">Core Capabilities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {capabilities.map((capability) => (
                  <div 
                    key={capability.title}
                    className="p-6 rounded-lg border border-foreground/10 bg-background/50 backdrop-blur-sm"
                  >
                    <h3 className="text-lg font-semibold mb-2">{capability.title}</h3>
                    <p className="text-muted-foreground">{capability.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
  
          {/* Technology Stack */}
          {techStack?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16"
            >
              <h2 className="text-2xl font-bold mb-8">Technology Stack</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {techStack.map((stack) => (
                  <div 
                    key={stack.category}
                    className="p-6 rounded-lg border border-foreground/10 bg-background/50 backdrop-blur-sm"
                  >
                    <h3 className="text-lg font-semibold mb-4">{stack.category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {stack.technologies.map((tech) => (
                        <span 
                          key={tech}
                          className="px-3 py-1 rounded-full bg-primary/10 text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
  
          {/* Standards & Certifications */}
          {standards?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16"
            >
              <h2 className="text-2xl font-bold mb-8">Standards & Certifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {standards.map((standard) => (
                  <div 
                    key={standard}
                    className="p-4 rounded-lg border border-foreground/10 bg-background/50 backdrop-blur-sm flex items-center gap-3"
                  >
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span>{standard}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    );
  }
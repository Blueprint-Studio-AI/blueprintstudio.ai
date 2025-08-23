// components/service-page/service-design/FeaturedProjects.tsx
import { motion } from 'framer-motion';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Project type definition
interface Project {
  title: string;
  description: string;
  image: string;
  category: string;
  results?: string[];
  link?: string;
  technologies: string[]; // Made required since category will be first tag
}

const featuredProjects: Project[] = [
  {
    title: "TokenWorks Unified Software Services",
    description: "Complete redesign of the patient journey for a major healthcare provider, focusing on improving satisfaction and outcomes.",
    image: "/images/work/healthcare-experience.png",
    category: "Healthcare",
    results: [
      "35% increase in patient satisfaction",
      "Reduced wait times by 45%",
      "Improved staff efficiency and morale"
    ],
    technologies: ["Journey Mapping", "Service Blueprinting", "Experience Design"],
  },
  {
    title: "Financial Services Onboarding",
    description: "Streamlined customer onboarding process for a financial institution, reducing friction and improving conversion.",
    image: "/images/work/financial-onboarding.png",
    category: "Financial Services",
    results: [
      "68% reduction in onboarding time",
      "42% increase in completion rate",
      "Significant reduction in support calls"
    ],
    technologies: ["Process Design", "Digital Integration", "CX Metrics"],
  },
  {
    title: "Public Sector Service Transformation",
    description: "Digital transformation of citizen services for a government agency, improving accessibility and efficiency.",
    image: "/images/work/public-sector.png",
    category: "Government",
    results: [
      "90% reduction in processing time",
      "Increased digital adoption by 78%",
      "Annual cost savings of $1.2M",
    ],
    technologies: ["Service Design", "Digital Transformation", "Change Management"],
  }
];

export function FeaturedProjects() {
  return (
    <section className="py-24">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Featured Service Design Projects
            </h2>
            <p className="text-muted-foreground">
              Transforming service experiences across industries
            </p>
          </div>

          {/* Projects Grid */}
          <div className="space-y-16">
            {featuredProjects.map((project, index) => (
                <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group"
                >
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Project Image */}
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                    <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    </div>

                    {/* Project Details */}
                    <div className="space-y-6">
                    <div>
                        <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
                        <p className="text-muted-foreground mb-6">
                        {project.description}
                        </p>
                    </div>

                    {/* Tags - Category first, followed by technologies */}
                    <div className="flex flex-wrap gap-2">
                    {/* Category tag - using a softer dark gray */}
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full border text-sm">
                        {project.category}
                    </span>
                    
                    {/* Technology tags remain the same */}
                    {project.technologies.map((tech) => (
                        <span
                        key={tech}
                        className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/5 text-sm"
                        >
                        {tech}
                        </span>
                    ))}
                    </div>

                    {/* Results */}
                    {project.results && (
                        <div className="space-y-2">
                        <h4 className="text-sm font-medium">Key Results</h4>
                        <div className="grid grid-cols-1 gap-2">
                            {project.results.map((result) => (
                            <div
                                key={result}
                                className="flex items-center gap-2 text-sm text-muted-foreground"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                {result}
                            </div>
                            ))}
                        </div>
                        </div>
                    )}

                    {/* CTA */}
                    {project.link && (
                        <Link
                        href={project.link}
                        className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                        >
                        View Case Study
                        <ArrowUpRight className="ml-1 w-4 h-4" />
                        </Link>
                    )}
                    </div>
                </div>
                </motion.div>
            ))}
            </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <Button size="lg">
                View More Projects
                <ExternalLink className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
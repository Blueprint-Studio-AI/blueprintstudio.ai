"use client";

import { Breadcrumb } from '../ui/breadcrumb';
import { 
  Hero, 
  ServiceOverview, 
  Solutions, 
} from '@/service-pages/components/sections/service-page-sections';

export function WebDevelopmentServicePage() {
  const data = {
    meta: {
      title: "Web Development Services | Blueprint Studio",
      description: "Expert web development services that transform your digital presence",
      categoryTag: "Create & Launch",
    },
    hero: {
      headline: "Web Development",
      valueProposition: "Transform your digital presence with modern, scalable solutions that drive real business growth.",
      ctaText: "Start Your Project",
      ctaUrl: "/contact",
      categoryTag: "Create & Launch"
    },
    overview: {
      description: "We deliver cutting-edge web development solutions that combine technical excellence with strategic thinking. Our approach focuses on creating scalable, high-performance applications that drive business growth.",
      capabilities: [
        {
          title: "Custom Development",
          description: "Bespoke web applications tailored to your specific business needs and objectives"
        },
        {
          title: "Platform Integration",
          description: "Seamless integration with existing systems and third-party services"
        },
        {
          title: "Performance Optimization",
          description: "Advanced optimization techniques for maximum speed and efficiency"
        }
      ],
      techStack: [
        {
          category: "Frontend",
          technologies: ["React", "Vue", "Angular", "Next.js", "TypeScript"]
        },
        {
          category: "Backend",
          technologies: ["Node.js", "Python", "Java", "PHP"]
        },
        {
          category: "Database",
          technologies: ["PostgreSQL", "MongoDB", "MySQL"]
        }
      ],
      standards: [
        "WCAG 2.1 AA Accessibility Standards",
        "Modern Security Best Practices",
        "Performance First Development",
        "Clean Code Standards",
        "Mobile-First Design Principles"
      ]
    },
    solutions: [
      {
        name: "WordPress Development",
        description: "Custom WordPress solutions built for performance and scalability",
        slug: "wordpress-development"
      },
      {
        name: "Custom Web Applications",
        description: "Bespoke web applications tailored to your business needs",
        slug: "custom-development"
      },
      {
        name: "API Integration",
        description: "Seamless integration of third-party services and APIs",
        slug: "api-integration"
      },
      {
        name: "E-commerce Development",
        description: "Scalable online stores built for growth",
        slug: "ecommerce-development"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background text-foreground services-theme">
      <main>
        <Breadcrumb
          items={[
            { label: 'Services', href: '/services' },
            { label: data.meta.title, href: '#' }
          ]}
        />

        <Hero
          headline={data.hero.headline}
          valueProposition={data.hero.valueProposition}
          ctaText={data.hero.ctaText}
          ctaUrl={data.hero.ctaUrl}
          categoryTag={data.meta.categoryTag}
        />

        <ServiceOverview
          description={data.overview.description}
          capabilities={data.overview.capabilities}
          techStack={data.overview.techStack}
          standards={data.overview.standards}
        />

        <Solutions solutions={data.solutions} />
      </main>
    </div>
  );
}
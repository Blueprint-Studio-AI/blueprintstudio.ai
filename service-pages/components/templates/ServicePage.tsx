// service-pages/components/templates/ServicePage.tsx
"use client";

import { Breadcrumb } from '../ui/breadcrumb';
import { 
  Hero, 
  ServiceOverview, 
  Solutions, 
  // IndustryApplications,
  // OtherServices,
  // ServiceCTA 
} from '../sections/service-page-sections';

// Types for the service page data
interface ServicePageProps {
  data: {
    meta: {
      title: string;
      description: string;
      categoryTag: string;
    };
    hero: {
      headline: string;
      valueProposition: string;
      ctaText: string;
      ctaUrl: string;
    };
    overview: {
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
    };
    solutions: Array<{
      name: string;
      description: string;
      slug: string;
    }>;
    industryApplications: Array<{
      industry: string;
      description: string;
      solutions: string[];
      slug: string;
    }>;
    relatedServices: Array<{
      name: string;
      description: string;
      slug: string;
    }>;
  };
}

export function ServicePage({ data }: ServicePageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground services-theme">
      <main>
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'Services', href: '/services' },
            { label: data.meta.title, href: '#' }
          ]}
        />

        {/* Hero Section */}
        <Hero
          headline={data.hero.headline}
          valueProposition={data.hero.valueProposition}
          ctaText={data.hero.ctaText}
          ctaUrl={data.hero.ctaUrl}
          categoryTag={data.meta.categoryTag}
        />

        {/* Service Overview */}
        <ServiceOverview
          description={data.overview.description}
          capabilities={data.overview.capabilities}
          techStack={data.overview.techStack}
          standards={data.overview.standards}
        />

        {/* Solutions Grid */}
        {/* <Solutions 
          solutions={data.solutions}
        /> */}

        {/* Industry Applications */}
        {/* <IndustryApplications
          applications={data.industryApplications}
        /> */}

        {/* Other Services */}
        {/* <OtherServices
          services={data.relatedServices}
        /> */}

        {/* Final CTA */}
        {/* <ServiceCTA /> */}
      </main>
    </div>
  );
}
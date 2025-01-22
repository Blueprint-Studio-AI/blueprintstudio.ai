// service-types/service-pages.ts
export interface ServicePage {
  meta: {
    title: string;
    description: string;
    keywords: string[];
    categoryTag: string;
    canonical: string;
    openGraph: {
      title: string;
      description: string;
    }
  };
  // HERO
  hero: {
    headline: string;
    valueProposition: string;
    ctaText: string;
    ctaUrl: string;
  };
  // SERVICE OVERVIEW
  overview: {
    description: string;
    capabilities: Array<{
      title: string;
      description: string;
    }>;
    techStack: {
      title: string;
      technologies: string[];
    }[];
    standards: string[];
  };
  // SOLUTIONS
  solutions: Array<{
    name: string;
    description: string;
    slug: string;
    featured: boolean;
  }>;
  // INDUSTRY APPLICATIONS
  industryApplications: Array<{
    name: string;
    description: string;
    solutions: Array<{
      name: string;
      description: string;
    }>;
    slug: string;
    featured: boolean;
  }>;
  // OTHER SERVICES
  relatedServices: Array<{
    name: string;
    description: string;
    slug: string;
  }>;
  // FINAL CTA
  cta: {
    headline: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
  };
}
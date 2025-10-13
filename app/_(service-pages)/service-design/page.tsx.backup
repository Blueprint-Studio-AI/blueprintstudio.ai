// app/(service-pages)/service-design/page.tsx
"use client";
import { ServiceDesignHero } from "@/components/service-page/service-design/ServiceDesignHero";
import { Footer } from "@/components/Footer";
import { PrimarySolutions } from "@/components/service-page/service-design/PrimarySolutions";
import { SolutionFinder } from "@/components/service-page/service-design/SolutionFinder";
import { IndustryGrid } from "@/components/service-page/service-design/IndustryGrid";
import { Process } from "@/components/service-page/service-design/Process";
import { TechnologyGrid } from "@/components/service-page/service-design/TechnologyGrid";
import { FeaturedProjects } from "@/components/service-page/service-design/FeaturedProjects";
import { ServiceDesignFAQ } from "@/components/service-page/service-design/ServiceDesignFAQ";
import { ServiceDesignTestimonials } from "@/components/service-page/service-design/ServiceDesignTestimonials";
import { ServiceDesignPricing } from "@/components/service-page/service-design/ServiceDesignPricing"

export default function ServiceDesignPage() {
    return (
      <main className="min-h-screen bg-background text-foreground relative">
        {/* Background patterns */}
        <div className="fixed inset-0 bg-dot-pattern opacity-5 pointer-events-none" />
        
        {/* Content */}
        <div className="relative">
          <div className="max-w-4xl mx-auto overflow-visible">
            <ServiceDesignHero />
            <PrimarySolutions />
            <div id="solution-finder">
            <SolutionFinder/>
            </div>
            <IndustryGrid />
            <TechnologyGrid />
            <Process />
            <FeaturedProjects />
          </div>
          <ServiceDesignFAQ />
          {/* <ServiceDesignTestimonials /> */}
          <ServiceDesignPricing />
          <Footer />
        </div>
      </main>
    );
  }
// app/web-design/page.tsx
"use client";
import { WebDesignHero } from "@/components/service-page/web-design/WebDesignHero";
import { Footer } from "@/components/Footer";
import { PrimarySolutions } from "@/components/service-page/web-design/PrimarySolutions";
import { SolutionFinder } from "@/components/service-page/web-design/SolutionFinder";
import { IndustryGrid } from "@/components/service-page/web-design/IndustryGrid";
import { Process } from "@/components/service-page/web-design/Process";
import { TechnologyGrid } from "@/components/service-page/web-design/TechnologyGrid";
import { FeaturedProjects } from "@/components/service-page/web-design/FeaturedProjects";
import { WebDesignFAQ } from "@/components/service-page/web-design/WebDesignFAQ";
import { WebDesignTestimonials } from "@/components/service-page/web-design/WebDesignTestimonials";
import { WebDesignPricing } from "@/components/service-page/web-design/WebDesignPricing"

// Notes:
// Pricing Section heading is bigger than others (headings on this page a bit smaller than others but kinda like it)
// Needs a copy read through and real content (case studies too)
// Service Finder Tool needs real results 
// Links need correct hrefs / adjusting (make list of pages to make so we can link them - fs )
// solutions section could use some pattern / icons / UI images in the bento boxes
// find your solution link should go to the finder section
// finder should start at 0% and end at 100% (also needs real results + question check)
// remove text cursor throughout and replace with pointer 
// read faq + edit
// real testimonials 
// add link to services page
// overall struture feels good tho

export default function WebDesignPage() {
    return (
      <main className="min-h-screen bg-background text-foreground services-theme relative">
        {/* Background patterns */}
        <div className="fixed inset-0 bg-dot-pattern opacity-5 pointer-events-none" />
        
        {/* Content */}
        <div className="relative">
          <div className="max-w-4xl mx-auto overflow-visible">
            <WebDesignHero />
            <PrimarySolutions />
            <SolutionFinder />
            <IndustryGrid />
            <TechnologyGrid />
            <Process />
            <FeaturedProjects />
          </div>
          <WebDesignFAQ />
          <WebDesignTestimonials />
          <WebDesignPricing />
          <Footer />
        </div>
      </main>
    );
  }
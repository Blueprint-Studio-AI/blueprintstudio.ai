// components/service-page/web-design/IndustryGrid.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Plus, Building2, ChevronDown, LucideIcon, Building, Scale, Stethoscope } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Industry category type
type IndustryCategory = {
  name: string;
  industries: {
    slug: string;
    name: string;
    description: string;
    icon?: LucideIcon;  
    featured?: boolean;
  }[];
};

const industryCategories: IndustryCategory[] = [
  {
    name: "Business & Professional",
    industries: [
      {
        slug: "healthcare",
        name: "Healthcare",
        description: "HIPAA-compliant websites for medical practices and healthcare providers",
        icon: Stethoscope,
        featured: true
      },
      {
        slug: "law-firms",
        name: "Law Firms",
        description: "Professional websites for attorneys and legal practices",
        icon: Scale, 
        featured: true
      },
      {
        slug: "real-estate",
        name: "Real Estate",
        description: "Property listing and agent websites",
        icon: Building, 
        featured: true
      },
      {
        slug: "financial-services",
        name: "Financial Services",
        description: "Secure websites for financial advisors and firms",
      },
      {
        slug: "consulting",
        name: "Consulting",
        description: "Lead-generating websites for consultants",
      }
    ]
  },
  {
    name: "Retail & Service",
    industries: [
      {
        slug: "ecommerce",
        name: "E-commerce",
        description: "Online stores and retail experiences",
      },
      {
        slug: "restaurants",
        name: "Restaurants",
        description: "Restaurant and food service websites",
      },
      {
        slug: "hospitality",
        name: "Hospitality",
        description: "Hotels and hospitality business websites",
      }
    ]
  },
  {
    name: "Technology",
    industries: [
      {
        slug: "saas",
        name: "SaaS",
        description: "Software as a Service company websites",
      },
      {
        slug: "startups",
        name: "Startups",
        description: "Fast-launch websites for startups",
      },
      {
        slug: "tech-companies",
        name: "Tech Companies",
        description: "Websites for technology companies",
      }
    ]
  }
];


export function IndustryGrid() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get featured industries
  const featuredIndustries = industryCategories
    .flatMap(cat => cat.industries)
    .filter(ind => ind.featured);

  return (
    <section className="py-24">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Industry-Specific Web Design Solutions
            </h2>
            <p className="text-muted-foreground">
              Tailored web design for your industry&apos;s unique requirements
            </p>
          </div>

        {/* Featured Industries Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
        {featuredIndustries.map((industry) => (
            <Link
            key={industry.slug}
            href="https://cal.com/blueprint-studio/intro-call"
            className="group relative overflow-hidden rounded-2xl border bg-background hover:bg-primary/5 
                hover:border-primary/20 transition-all duration-300"
            >
            <div className="flex flex-col h-full">
                <div className="p-8 flex justify-center items-center">
                    {industry.icon && (
                        <industry.icon className="w-12 h-12 text-gray-300 group-hover:text-primary transition-colors" />
                    )}
                </div>
                <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {industry.name}
                    </h3>
                    <p className="text-muted-foreground">
                    {industry.description}
                    </p>
                </div>
                
                <div className="flex items-center text-sm font-medium text-primary pt-4">
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
                </div>
            </div>
            </Link>
        ))}
        </div>

          {/* Expand/Collapse Section */}
          <div className="text-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                border hover:bg-primary/5 hover:border-primary/20 transition-all"
            >
              {isExpanded ? (
                <>
                  Show Less
                  <ChevronDown className="w-4 h-4 rotate-180" />
                </>
              ) : (
                <>
                  View All Industries
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Expanded List */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-12 space-y-12">
                  {industryCategories.map((category) => (
                    <div key={category.name}>
                      <h3 className="text-xl font-semibold mb-6">{category.name}</h3>
                      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {category.industries.map((industry) => (
                          <Link
                            key={industry.slug}
                            href="https://cal.com/blueprint-studio/intro-call"
                            className="p-4 rounded-xl border hover:bg-primary/5 
                              hover:border-primary/20 transition-all group"
                          >
                            <h4 className="font-medium mb-1 group-hover:text-primary 
                              transition-colors">
                              {industry.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {industry.description}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
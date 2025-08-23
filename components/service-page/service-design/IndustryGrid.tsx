// components/service-page/service-design/IndustryGrid.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Plus, ChevronDown, LucideIcon, Stethoscope, Building, Briefcase, ShoppingBag, Landmark, GraduationCap } from 'lucide-react';
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
    name: "Healthcare & Public Services",
    industries: [
      {
        slug: "healthcare",
        name: "Healthcare",
        description: "Patient-centered service design for healthcare providers",
        icon: Stethoscope,
        featured: true
      },
      {
        slug: "government",
        name: "Government",
        description: "Citizen-focused public service design",
        icon: Landmark, 
        featured: true
      },
      {
        slug: "education",
        name: "Education",
        description: "Educational service design for institutions",
        icon: GraduationCap, 
        featured: true
      },
      {
        slug: "nonprofit",
        name: "Nonprofit",
        description: "Mission-driven service design for nonprofits",
      }
    ]
  },
  {
    name: "Financial & Professional Services",
    industries: [
      {
        slug: "banking",
        name: "Banking & Finance",
        description: "Customer-centric financial service design",
      },
      {
        slug: "insurance",
        name: "Insurance",
        description: "Streamlined insurance service experiences",
      },
      {
        slug: "consulting",
        name: "Consulting",
        description: "Professional service design for consultancies",
        icon: Briefcase
      }
    ]
  },
  {
    name: "Retail & Hospitality",
    industries: [
      {
        slug: "retail",
        name: "Retail",
        description: "Omnichannel retail service experiences",
        icon: ShoppingBag
      },
      {
        slug: "hospitality",
        name: "Hospitality",
        description: "Guest-focused hospitality service design",
      },
      {
        slug: "restaurants",
        name: "Restaurants",
        description: "Dining and food service experiences",
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
              Industry-Specific Service Design Solutions
            </h2>
            <p className="text-muted-foreground">
              Tailored service design for your industry&apos;s unique challenges and opportunities
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
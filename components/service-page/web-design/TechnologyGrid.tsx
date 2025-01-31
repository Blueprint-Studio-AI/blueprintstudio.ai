// components/service-page/web-design/TechnologyGrid.tsx
import { motion } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  SiNextdotjs, SiReact, SiTypescript, SiTailwindcss, SiVercel,
  SiPostgresql, SiSupabase, SiFramer, SiNodedotjs, SiPython, SiWordpress, 
  SiDigitalocean, SiWebflow, SiFigma, SiGoogleanalytics, SiGoogleads,
  SiGooglesearchconsole, SiGoogletagmanager, SiMeta, SiOpenai, SiMixpanel,
  SiHotjar, SiHuggingface, SiShopify, SiContentful,
} from 'react-icons/si';
import { Brain, Cpu, ArrowUpRight } from 'lucide-react';

const technologies = [
    {
      category: "Design & Development",
      description: "Modern frameworks and design tools",
      tools: [
        { name: "Next.js", icon: SiNextdotjs, description: "React framework for production" },
        { name: "React", icon: SiReact, description: "UI component library" },
        { name: "TypeScript", icon: SiTypescript, description: "Type-safe JavaScript" },
        { name: "Node.js", icon: SiNodedotjs, description: "Server-side JavaScript" },
        { name: "Python", icon: SiPython, description: "Backend & automation" },
        { name: "Tailwind CSS", icon: SiTailwindcss, description: "Utility-first CSS" },
        { name: "Figma", icon: SiFigma, description: "Design & prototyping" },
        { name: "Framer", icon: SiFramer, description: "Interactive design" }
      ]
    },
    {
      category: "CMS",
      description: "Content management systems",
      tools: [
        { name: "WordPress", icon: SiWordpress, description: "Content management" },
        { name: "Webflow", icon: SiWebflow, description: "Visual development" },
        { name: "Shopify", icon: SiShopify, description: "E-commerce platform" },
        { name: "Contentful", icon: SiContentful, description: "Headless CMS" }
      ]
    },
    {
      category: "Infrastructure",
      description: "Hosting and database solutions",
      tools: [
        { name: "Vercel", icon: SiVercel, description: "Edge deployment" },
        { name: "Digital Ocean", icon: SiDigitalocean, description: "Cloud hosting" },
        { name: "PostgreSQL", icon: SiPostgresql, description: "Relational database" },
        { name: "Supabase", icon: SiSupabase, description: "Backend as a service" }
      ]
    },
    {
      category: "AI",
      description: "Artificial intelligence tools",
      tools: [
        { name: "Claude", icon: Brain, description: "Anthropic AI assistant" },
        { name: "OpenAI", icon: SiOpenai, description: "AI integration" },
        { name: "Hugging Face", icon: SiHuggingface, description: "AI models & deployment" },
        { name: "Replicate", icon: Cpu, description: "AI infrastructure" } 
    ]
    },
    {
      category: "Analytics",
      description: "Measurement and tracking tools",
      tools: [
        { name: "Analytics", icon: SiGoogleanalytics, description: "Web analytics" },
        { name: "Tag Manager", icon: SiGoogletagmanager, description: "Tag management" },
        { name: "Mixpanel", icon: SiMixpanel, description: "Product analytics" },
        { name: "Hotjar", icon: SiHotjar, description: "User behavior analytics" }
      ]
    },
    {
      category: "Marketing",
      description: "Growth and advertising platforms",
      tools: [
        { name: "Google Ads", icon: SiGoogleads, description: "Search & display ads" },
        { name: "Search Console", icon: SiGooglesearchconsole, description: "SEO tools" },
        { name: "Meta Ads", icon: SiMeta, description: "Social advertising" },
        { name: "Merchant Center", icon: SiGoogleads, description: "Product listings" }
      ]
    }
  ];

export function TechnologyGrid() {
    const [activeCategory, setActiveCategory] = useState(technologies[0].category);
  
    return (
      <section className="py-24">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Full-Stack Technology Partner
            </h2>
            <p className="text-muted-foreground">
              We leverage a comprehensive suite of modern tools and platforms to build, 
              deploy, and grow exceptional digital experiences.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {technologies.map((category) => (
              <button
                key={category.category}
                onClick={() => setActiveCategory(category.category)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors",
                  activeCategory === category.category
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary/5 hover:bg-primary/10"
                )}
              >
                {category.category}
              </button>
            ))}
          </div>

          {/* Tools Grid */}
          <motion.div 
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {technologies
              .find(cat => cat.category === activeCategory)
              ?.tools.map((tool, index) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative p-4 rounded-xl border border-foreground/10 
                    hover:border-primary/20 transition-all duration-300 
                    bg-background/50 backdrop-blur-sm h-[120px] flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <tool.icon className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="font-medium truncate">{tool.name}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {tool.description}
                  </p>
                </motion.div>
              ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
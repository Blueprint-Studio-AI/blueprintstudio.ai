// components/service-page/service-design/TechnologyGrid.tsx
import { motion } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  SiFigma, SiLinear
} from 'react-icons/si';
import { Users, ArrowUpRight, FileSpreadsheet, Map, Workflow, Globe, PenTool, Layers, Eye } from 'lucide-react';

const technologies = [
    {
        category: "Service Design Methods",
        description: "Methodologies and frameworks for service innovation",
        tools: [
          { name: "Journey Maps", icon: Map, description: "Visualize and optimize customer experiences across touchpoints" },
          { name: "Service Blueprints", icon: Workflow, description: "Map front-stage and back-stage processes to identify improvement opportunities" },
          { name: "Personas", icon: Users, description: "Evidence-based user archetypes that drive decision-making" },
          { name: "Stakeholder Maps", icon: FileSpreadsheet, description: "Identify key relationships and influence patterns" },
          { name: "User Interviews", icon: Users, description: "Gather rich qualitative insights directly from users" },
          { name: "Ethnographic Research", icon: Eye, description: "Observe users in their natural environment" },
          { name: "Experience Prototyping", icon: Layers, description: "Test service concepts before full implementation" },
          { name: "Value Proposition Canvas", icon: PenTool, description: "Align offerings with user needs" },
          { name: "Ecosystem Mapping", icon: Globe, description: "Visualize complex service systems and environments" }
        ]
      },
    {
      category: "Artifact Creation Tools",
      description: "Tools for team collaboration and communication",
      tools: [
        { name: "Figma", icon: SiFigma, description: "Design and prototyping" },
      ]
    },
    {
      category: "Project Management",
      description: "Tools for managing service design projects",
      tools: [
        { name: "Linear", icon: SiLinear, description: "Project management" },
      ]
    },
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
              Service Design Toolkit
            </h2>
            <p className="text-muted-foreground">
              We leverage a comprehensive suite of modern tools and methodologies to research, 
              design, and implement exceptional service experiences.
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
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Brain, Server, ChevronDown, Compass, Factory, Target, Wand2, Video, Layers, Code2, Globe, Palette, Smartphone, Megaphone, Database, LineChart, BarChart2, Share2, Layout} from 'lucide-react';
// import { services } from '@/service-pages/data';
import { useState, useCallback, memo } from 'react';
import { SectionTitle } from '../ui/section-title';
import { ServiceLine } from '../ui/service-line';

// Types
interface ServiceLine {
  slug?: string;  
  name: string;
  description: string;
  icon?: any;     
  features?: any[]; 
}

interface CoreService {
  slug: string;
  name: string;
  description: string;
  icon?: any;     // Add icon
  serviceLines: ServiceLine[];
}

interface ServicesProps {
  customTitle?: string;
  customDescription?: string;
  useSimpleTitle?: boolean;  // To toggle between styles
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
      duration: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -4 },
  show: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.1
    }
  }
};

const services = {
  coreServices: [
    {
      slug: 'design',
      name: 'Design',
      description: 'Create exceptional digital experiences that delight users',
      icon: Palette,
      serviceLines: [
        {
          slug: 'web-design',
          name: 'Web Design',
          description: 'Responsive, modern website design',
          icon: Globe,
          features: []
        },
        {
          name: 'UX/UI Design',
          description: 'User-centered interface and experience design',
          icon: Layout,
          features: []
        },
        {
          name: 'Product Design',
          description: 'End-to-end digital product design',
          icon: Wand2,
          features: []
        },
        {
          name: 'Brand Design',
          description: 'Identity design and brand systems',
          icon: Palette,
          features: []
        }
      ]
    },
    {
      slug: 'development',
      name: 'Development',
      description: 'Build scalable, robust digital solutions',
      icon: Code2,
      serviceLines: [
        {
          name: 'Web Development',
          description: 'Custom websites and web applications',
          icon: Globe,
          features: []
        },
        {
          name: 'Mobile Development',
          description: 'Native and cross-platform mobile apps',
          icon: Smartphone,
          features: []
        },
        {
          name: 'AI Applications',
          description: 'Custom AI-powered applications',
          icon: Brain,
          features: []
        },
        {
          name: 'Custom Software',
          description: 'Bespoke software solutions',
          icon: Database,
          features: []
        },
        {
          name: 'Cloud & Infrastructure',
          description: 'Scalable cloud solutions',
          icon: Server, 
          features: []
        }
      ]
    },
    {
      slug: 'marketing',
      name: 'Marketing',
      description: 'Grow your digital presence and reach',
      icon: LineChart,
      serviceLines: [
        {
          name: 'Digital Marketing',
          description: 'Comprehensive marketing strategies',
          icon: Megaphone,
          features: []
        },
        {
          name: 'SEO',
          description: 'Search engine optimization',
          icon: BarChart2,
          features: []
        },
        {
          name: 'Social Media',
          description: 'Social media management and strategy',
          icon: Share2,
          features: []
        },
        {
          name: 'Paid Advertising',
          description: 'PPC and performance marketing',
          icon: Target,
          features: []
        },
        {
          name: 'Content Creation',
          description: 'Photography, video, and written content',
          icon: Video,
          features: []
        }
      ]
    },
    {
      slug: 'strategy',
      name: 'Strategy',
      description: 'Define your digital future and roadmap',
      icon: Brain,
      serviceLines: [
        {
          name: 'Service Design',
          description: 'End-to-end service experience design',
          icon: Layers,
          features: []
        },
        {
          name: 'Digital Transformation',
          description: 'Business transformation strategy',
          icon: Factory,
          features: []
        },
        {
          name: 'AI & Automation',
          description: 'Process automation and AI integration',
          icon: Bot,
          features: []
        },
        {
          name: 'Innovation Consulting',
          description: 'Future-focused technology guidance',
          icon: Compass,
          features: []
        }
      ]
    }
  ]
};


// Memoized CoreService component
const CoreServiceItem = memo(({ 
  coreService, 
  isActive, 
  isExpanded, 
  onClick 
}: {
  coreService: CoreService;
  isActive: boolean;
  isExpanded: boolean;
  onClick: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    onClick={onClick}
    className="relative group"
    role="button"
    aria-expanded={isExpanded}
    tabIndex={0}
  >
    <div 
      className={`p-8 rounded-xl border transition-all duration-200 ${
        isActive && (isExpanded || window.innerWidth >= 1024)
          ? 'bg-primary/5 border-primary/20 scale-[1.02]' 
          : 'border-transparent hover:bg-primary/5 hover:border-primary/10'
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold transition-colors duration-200 group-hover:text-primary">
          {coreService.name}
        </h3>
        <ChevronDown 
          className={`w-5 h-5 lg:hidden transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </div>
      <p className="text-muted-foreground transition-colors duration-200 group-hover:text-foreground/80 mt-2">
        {coreService.description}
      </p>
    </div>

    {/* Mobile Service Lines */}
    <div 
      className={`lg:hidden ${isExpanded ? 'block' : 'hidden'}`}
      role="region"
      aria-label={`${coreService.name} services`}
    >
      <div className="space-y-3 mt-4 pl-8">
        {coreService.serviceLines.map((serviceLine) => (
          <ServiceLine
            key={serviceLine.name}
            name={serviceLine.name}
            description={serviceLine.description}
            href={`/${serviceLine.slug}`}
          />
        ))}
      </div>
    </div>
  </motion.div>
));

CoreServiceItem.displayName = 'CoreServiceItem';

export function Services({ 
  customTitle,
  customDescription,
  useSimpleTitle = false
}: ServicesProps) {
  const [activeService, setActiveService] = useState(services.coreServices[0].slug);
  const [expandedService, setExpandedService] = useState<string | null>(null);

  const handleServiceClick = useCallback((slug: string) => {
    if (window.innerWidth < 1024) {
      setExpandedService(prev => prev === slug ? null : slug);
    }
    setActiveService(slug);
  }, []);

  const handleMouseEnter = useCallback((slug: string) => {
    if (window.innerWidth >= 1024) {
      setActiveService(slug);
    }
  }, []);

  return (
    <section 
      className="py-24 relative"
      aria-label="Our Services"
    >
      <div className="container px-4">
        {useSimpleTitle ? (
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {customTitle || "What We Do"}
            </h2>
            <p className="text-gray-600">
              {customDescription || "Transforming complex challenges into elegant, user-centric solutions for forward-thinking brands."}
            </p>
          </div>
        ) : (
          <SectionTitle
            title={customTitle || "What We Do"}
            description={customDescription || "Transforming complex challenges into elegant, user-centric solutions for forward-thinking brands."}
            align='center'
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Core Services List */}
          <div className="lg:col-span-5">
            <div className="space-y-4 lg:pb-48">
              {services.coreServices.map((coreService) => (
                <CoreServiceItem
                  key={coreService.slug}
                  coreService={coreService}
                  isActive={activeService === coreService.slug}
                  isExpanded={expandedService === coreService.slug}
                  onClick={() => handleServiceClick(coreService.slug)}
                />
              ))}
            </div>
          </div>

          {/* Service Lines List - Desktop */}
          <div className="hidden lg:block lg:col-span-7">
            <div className="lg:sticky lg:top-8 overflow-visible">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeService}
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="space-y-3"
                  role="list"
                  aria-label="Service details"
                >
              {services.coreServices
                .find(s => s.slug === activeService)
                ?.serviceLines.map((serviceLine) => (
                  <motion.div
                    key={serviceLine.name}  // Use name instead of slug
                    variants={itemVariants}
                    layout
                    role="listitem"
                  >
                    <ServiceLine
                      name={serviceLine.name}
                      description={serviceLine.description}
                      href={serviceLine.slug ? `/${serviceLine.slug}` : undefined}
                    />
                  </motion.div>
                    ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
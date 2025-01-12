import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { services } from '@/service-pages/data';
import { useState, useCallback, memo } from 'react';
import { SectionTitle } from '../ui/section-title';
import { ServiceLine } from '../ui/service-line';

// Types
interface ServiceLine {
  slug: string;
  name: string;
  description: string;
}

interface CoreService {
  slug: string;
  name: string;
  description: string;
  serviceLines: ServiceLine[];
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
    {/* TODO fix bug with window */}
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
            key={serviceLine.slug}
            name={serviceLine.name}
            description={serviceLine.description}
            href={`/services/${coreService.slug}/${serviceLine.slug}`}
          />
        ))}
      </div>
    </div>
  </motion.div>
));

CoreServiceItem.displayName = 'CoreServiceItem';

export function Services() {
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
      <div className="absolute inset-0 bg-dot-pattern opacity-5" aria-hidden="true" />
      
      <div className="container px-4">
        <SectionTitle
          title="What We Do"
          description="Transforming complex challenges into elegant, user-centric solutions for forward-thinking brands."
          align='center'
          />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Core Services List */}
          <div className="lg:col-span-5">
            <div className="space-y-4 lg:pb-96">
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
                        key={serviceLine.slug}
                        variants={itemVariants}
                        layout
                        role="listitem"
                      >
                        <ServiceLine
                          name={serviceLine.name}
                          description={serviceLine.description}
                          href={`/services/${activeService}/${serviceLine.slug}`}
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
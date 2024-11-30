import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { services } from '@/service-pages/data';
import { useState } from 'react';
import { SectionTitle } from '../ui/section-title';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
      duration: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, x: -4 },
  show: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.1
    }
  }
};

export function Services() {
  const [activeService, setActiveService] = useState(services.coreServices[0].slug);
  const [expandedService, setExpandedService] = useState<string | null>(null);

  const handleServiceClick = (slug: string) => {
    if (window.innerWidth < 1024) {
      // If clicking the same service that's already expanded, close it
      if (expandedService === slug) {
        setExpandedService(null);
        return;
      }
      setExpandedService(slug);
    }
    setActiveService(slug);
  };

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-dot-pattern opacity-5" />
      
      <div className="container px-4">

        <SectionTitle
          title="What We Do"
          description="Design & build solutions that transform businesses and drive growth."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Core Services List - Left Side */}
          <div className="lg:col-span-5">
            <div className="space-y-4 lg:pb-96">
              {services.coreServices.map((coreService, index) => (
                <motion.div
                  key={coreService.slug}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: index * 0.05,
                    duration: 0.2
                  }}
                  onMouseEnter={() => window.innerWidth >= 1024 && setActiveService(coreService.slug)}
                  onClick={() => handleServiceClick(coreService.slug)}
                  className="relative group"
                >
                  <div 
                    className={`p-8 rounded-xl border transition-all duration-200 ${
                      activeService === coreService.slug && (expandedService === coreService.slug || window.innerWidth >= 1024)
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
                          expandedService === coreService.slug ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                    <p className="text-muted-foreground transition-colors duration-200 group-hover:text-foreground/80 mt-2">
                      {coreService.description}
                    </p>
                  </div>

                  {/* Mobile Service Lines */}
                  <div className={`lg:hidden ${expandedService === coreService.slug ? 'block' : 'hidden'}`}>
                    <div className="space-y-3 mt-4 pl-8">
                      {coreService.serviceLines.map((serviceLine) => (
                        <Link
                          key={serviceLine.slug}
                          href={`/services/${coreService.slug}/${serviceLine.slug}`}
                          className="block group"
                        >
                          <div className="p-4 rounded-lg border border-primary/10 hover:border-primary/20 hover:bg-primary/5 transition-all duration-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-base font-medium group-hover:text-primary transition-colors duration-200">
                                  {serviceLine.name}
                                </h4>
                                <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-200">
                                  {serviceLine.description}
                                </p>
                              </div>
                              <div className="relative w-8 h-8 shrink-0 ml-4">
                                <div className="absolute inset-0 rounded-full bg-primary/5 transition-transform duration-200 group-hover:scale-110" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <ArrowUpRight className="w-4 h-4 text-primary transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Service Lines List - Right Side (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-7">
            <div className="lg:sticky lg:top-8 overflow-visible">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeService}
                  variants={container}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="space-y-3"
                >
                  {services.coreServices
                    .find(s => s.slug === activeService)
                    ?.serviceLines.map((serviceLine) => (
                      <motion.div
                        key={serviceLine.slug}
                        variants={item}
                        layout
                      >
                        <Link 
                          href={`/services/${activeService}/${serviceLine.slug}`}
                          className="block group"
                        >
                          <div className="p-4 rounded-lg border border-primary/10 hover:border-primary/20 hover:bg-primary/5 transition-all duration-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-base font-medium group-hover:text-primary transition-colors duration-200">
                                  {serviceLine.name}
                                </h4>
                                <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-200">
                                  {serviceLine.description}
                                </p>
                              </div>
                              <div className="relative w-8 h-8 shrink-0 ml-4">
                                <div className="absolute inset-0 rounded-full bg-primary/5 transition-transform duration-200 group-hover:scale-110" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <ArrowUpRight className="w-4 h-4 text-primary transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
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